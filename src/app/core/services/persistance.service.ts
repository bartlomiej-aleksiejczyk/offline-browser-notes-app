import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root',
})
export class PersistanceService {
  private dbName = 'NotesAppDB';
  private notesStoreName = 'notes';
  private directoriesStoreName = 'directories';
  private defaultNoteStorageKey = 'defaultNoteContent';
  private db!: IDBPDatabase;
  private dbInitialized: Promise<void>;

  constructor() {
    this.dbInitialized = this.initDB();
  }

  private async initDB(): Promise<void> {
    this.db = await openDB(this.dbName, 4, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'title' });
        }
        if (!db.objectStoreNames.contains('directories')) {
          db.createObjectStore('directories', { keyPath: 'title' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }

  // Directory-specific methods
  async addDirectory(title: string): Promise<void> {
    await this.dbInitialized;

    const existingDirectory = await this.db.get(
      this.directoriesStoreName,
      title
    );
    if (existingDirectory) {
      throw new Error(`Directory with title "${title}" already exists`);
    }
    const transaction = this.db.transaction(
      this.directoriesStoreName,
      'readwrite'
    );
    const store = transaction.objectStore(this.directoriesStoreName);
    await store.add({ title: title, index: 0 });
    await transaction.done;
    await this.reorderDirectories();
  }

  async deleteDirectory(title: string): Promise<void> {
    const allNotes = await this.getAllNotes();
    const notesInDirectory = allNotes.filter(
      (note) => note.parentTitle === title
    );
    if (notesInDirectory.length > 0) {
      throw new Error(`Directory "${title}" is not empty`);
    }
    await this.db.delete(this.directoriesStoreName, title);
  }

  async getAllDirectoriesName(): Promise<string[]> {
    await this.dbInitialized;

    const allDirectories = await this.db.getAll(this.directoriesStoreName);
    return allDirectories.map((directory) => directory.title);
  }

  async getAllDirectories(): Promise<any[]> {
    await this.dbInitialized;

    const allDirectories = await this.db.getAll(this.directoriesStoreName);
    return allDirectories;
  }

  async updateDirectoryTitle(
    oldTitle: string,
    newTitle: string
  ): Promise<void> {
    await this.dbInitialized;

    const allDirectories = await this.getAllDirectoriesName();
    if (!allDirectories.includes(oldTitle)) {
      throw new Error(`Directory with title "${oldTitle}" not found`);
    }
    const existingDirectory = await this.db.get(
      this.directoriesStoreName,
      newTitle
    );
    if (existingDirectory) {
      throw new Error(`Directory with title "${newTitle}" already exists`);
    }

    const allNotes = await this.getAllNotes();
    const notesInDirectory = allNotes.filter(
      (note) => note.parentTitle === oldTitle
    );

    const transaction = this.db.transaction(
      [this.notesStoreName, this.directoriesStoreName],
      'readwrite'
    );
    const notesStore = transaction.objectStore(this.notesStoreName);
    const directoriesStore = transaction.objectStore(this.directoriesStoreName);

    for (const note of notesInDirectory) {
      note.parentTitle = newTitle;
      await notesStore.put(note);
    }

    const directory = await directoriesStore.get(oldTitle);
    if (directory) {
      directory.title = newTitle;
      await directoriesStore.put(directory);
    }

    await transaction.done;
  }

  async getNotesByDirectory(directoryTitle: string): Promise<Note[]> {
    await this.dbInitialized;

    const allNotes = await this.getAllNotes();
    return allNotes.filter((note) => note.parentTitle === directoryTitle);
  }

  async addNote(
    note: Omit<Note, 'index'>,
    position: 'start' | 'end' | number = 'end'
  ): Promise<void> {
    await this.dbInitialized;

    const allNotes = await this.getAllNotes();
    const existingNote = allNotes.find((n) => n.title === note.title);
    if (existingNote) {
      throw new Error(`A note with the title "${note.title}" already exists`);
    }

    let insertIndex: number;

    if (position === 'start') {
      insertIndex = 0;
    } else if (position === 'end') {
      insertIndex = allNotes.length;
    } else if (typeof position === 'number') {
      insertIndex = Math.max(0, Math.min(position, allNotes.length));
    } else {
      throw new Error('Invalid position specified');
    }

    const transaction = this.db.transaction(this.notesStoreName, 'readwrite');
    const store = transaction.objectStore(this.notesStoreName);

    for (const noteToShift of allNotes.filter((n) => n.index >= insertIndex)) {
      noteToShift.index++;
      await store.put(noteToShift);
    }

    const newNote: Note = { ...note, index: insertIndex };
    await store.add(newNote);

    await transaction.done;
  }

  async getAllNotes(): Promise<Note[]> {
    await this.dbInitialized;
    return await this.db.getAll(this.notesStoreName);
  }

  async getSortedNotes(): Promise<Note[]> {
    await this.dbInitialized;
    const transaction = this.db.transaction(this.notesStoreName, 'readonly');
    const store = transaction.objectStore(this.notesStoreName);
    const allNotes: Note[] = await store.getAll();

    return allNotes.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  }

  async createDirectory(directoryTitle: string): Promise<void> {
    await this.dbInitialized;

    const transaction = this.db.transaction(
      this.directoriesStoreName,
      'readwrite'
    );
    const store = transaction.objectStore(this.directoriesStoreName);

    const newDirectory = {
      title: directoryTitle,
      createdAt: new Date(),
    };

    await store.add(newDirectory);
    await transaction.done;
  }

  async updateDirectory(oldTitle: string, newTitle: string): Promise<void> {
    await this.dbInitialized;

    const allDirectories = await this.getAllDirectoriesName();
    const directory = allDirectories.find((dir) => dir === oldTitle);
    if (!directory) {
      throw new Error(`Directory with title "${oldTitle}" not found`);
    }

    const transaction = this.db.transaction(
      this.directoriesStoreName,
      'readwrite'
    );
    const store = transaction.objectStore(this.directoriesStoreName);

    const updatedDirectory = {
      title: newTitle,
    };

    await store.put(updatedDirectory);
    await store.delete(directory);

    await transaction.done;

    await this.updateNotesParent(directory, newTitle);
  }

  private async updateNotesParent(
    oldTitle: string,
    newTitle: string
  ): Promise<void> {
    await this.dbInitialized;

    const allNotes = await this.getAllNotes();
    const notesToUpdate = allNotes.filter(
      (note) => note.parentTitle === oldTitle
    );

    const transaction = this.db.transaction(this.notesStoreName, 'readwrite');
    const store = transaction.objectStore(this.notesStoreName);

    for (const note of notesToUpdate) {
      note.parentTitle = newTitle;
      await store.put(note);
    }

    await transaction.done;
  }
  private async reorderNotes(): Promise<void> {
    await this.dbInitialized;

    const allNotes = await this.getAllNotes();
    const sortedNotes = allNotes.sort((a, b) => a.index - b.index);

    const transaction = this.db.transaction(this.notesStoreName, 'readwrite');
    const store = transaction.objectStore(this.notesStoreName);

    for (let i = 0; i < sortedNotes.length; i++) {
      const note = sortedNotes[i];
      note.index = i + 1;
      await store.put(note);
    }
    await transaction.done;
  }

  private async reorderDirectories(): Promise<void> {
    await this.dbInitialized;

    const allDirectories = await this.getAllDirectories();
    const sortedDirectories = allDirectories.sort((a, b) => a.index - b.index);

    const transaction = this.db.transaction(
      this.directoriesStoreName,
      'readwrite'
    );
    const store = transaction.objectStore(this.directoriesStoreName);

    for (let i = 0; i < sortedDirectories.length; i++) {
      const directory = sortedDirectories[i];
      directory.index = i + 1;
      await store.put(directory);
    }
    await transaction.done;
  }

  async deleteNote(title: string): Promise<void> {
    const allNotes = await this.getAllNotes();

    const noteToDelete = allNotes.find((note) => note.title === title);
    if (!noteToDelete) {
      throw new Error(`Note with title "${title}" not found`);
    }

    await this.db.delete(this.notesStoreName, noteToDelete.title);

    await this.reorderNotes();
  }

  async setSelectedNote(title: string): Promise<void> {
    await this.dbInitialized;

    const transaction = this.db.transaction('settings', 'readwrite');
    const store = transaction.objectStore('settings');
    await store.put(title, 'selectedNote');
    await transaction.done;
  }

  async reorderNote(noteTitle: string, targetIndex: number): Promise<void> {
    const allNotes = await this.getAllNotes();

    const validIndex = Math.max(0, Math.min(targetIndex, allNotes.length - 1));

    const noteToMove = allNotes.find((note) => note.title === noteTitle);
    if (!noteToMove) {
      throw new Error(`Note with title "${noteTitle}" not found`);
    }

    const notesWithoutMoved = allNotes.filter(
      (note) => note.title !== noteTitle
    );

    notesWithoutMoved.splice(validIndex, 0, noteToMove);

    const transaction = this.db.transaction(this.notesStoreName, 'readwrite');
    const store = transaction.objectStore(this.notesStoreName);

    for (let i = 0; i < notesWithoutMoved.length; i++) {
      const note = notesWithoutMoved[i];
      note.index = i;
      await store.put(note);
    }

    await transaction.done;
  }

  async getNoteByTitle(title: string): Promise<Note | undefined> {
    const allNotes = await this.getAllNotes();
    return allNotes.find((note) => note.title === title);
  }

  async updateNote(note: Note): Promise<void> {
    await this.dbInitialized;

    await this.db.put(this.notesStoreName, note);
  }

  async getSelectedNoteTitle(): Promise<string | null> {
    await this.dbInitialized;

    return await this.db.get('settings', 'selectedNote');
  }

  getDefaultNoteContent(): string | null {
    return localStorage.getItem(this.defaultNoteStorageKey);
  }

  setDefaultNoteContent(content: string): void {
    localStorage.setItem(this.defaultNoteStorageKey, content);
  }

  async getAllNotesGroupedByDirectory() {
    const allDirectories = [
      ...(await this.getAllDirectories()),
      { title: 'undefined~title', index: -1 },
    ];
    const allNotes = await this.getAllNotes();
    const groupedNotes = allDirectories.map((directory) => {
      let files = allNotes.filter(
        (note) => note?.parentTitle === directory?.title
      );
      if (directory?.title === 'undefined~title') {
        files = allNotes.filter((note) => !note?.parentTitle);
      }
      return { ...directory, files: files };
    });
    return groupedNotes;
  }
}
