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
    this.db = await openDB(this.dbName, 1, {
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

  // Add a note to the 'notes' store
  async addNote(
    note: Omit<Note, 'index'>,
    position: 'start' | 'end' | number = 'end'
  ): Promise<void> {
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

  // Get all notes
  async getAllNotes(): Promise<Note[]> {
    await this.dbInitialized;
    return await this.db.getAll(this.notesStoreName);
  }

  // Get sorted notes
  async getSortedNotes(): Promise<Note[]> {
    await this.dbInitialized;
    const transaction = this.db.transaction(this.notesStoreName, 'readonly');
    const store = transaction.objectStore(this.notesStoreName);
    const allNotes: Note[] = await store.getAll();

    return allNotes.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  }

  // Create a new directory in the 'directories' store
  async createDirectory(directoryTitle: string): Promise<void> {
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

  // Get all directories
  async getAllDirectories(): Promise<string[]> {
    await this.dbInitialized;
    const transaction = this.db.transaction(
      this.directoriesStoreName,
      'readonly'
    );
    const store = transaction.objectStore(this.directoriesStoreName);
    const allDirectories = await store.getAll();

    return allDirectories.map((dir) => dir.title);
  }

  // Update a directory's name
  async updateDirectory(oldTitle: string, newTitle: string): Promise<void> {
    const allDirectories = await this.getAllDirectories();
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
      createdAt: new Date(),
    };

    await store.put(updatedDirectory);
    await transaction.done;

    // Now, update all notes that belong to this directory
    await this.updateNotesParent(directory, newTitle);
  }

  // Update the parentName of all notes belonging to a specific directory
  private async updateNotesParent(
    oldTitle: string,
    newTitle: string
  ): Promise<void> {
    const allNotes = await this.getAllNotes();
    const notesToUpdate = allNotes.filter(
      (note) => note.parentName === oldTitle
    );

    const transaction = this.db.transaction(this.notesStoreName, 'readwrite');
    const store = transaction.objectStore(this.notesStoreName);

    for (const note of notesToUpdate) {
      note.parentName = newTitle;
      await store.put(note);
    }

    await transaction.done;
  }

  // Delete a directory and update all notes with the removed directory's title
  async removeDirectory(directoryTitle: string): Promise<void> {
    const allDirectories = await this.getAllDirectories();
    const directoryIndex = allDirectories.indexOf(directoryTitle);

    if (directoryIndex === -1) {
      throw new Error(`Directory with title "${directoryTitle}" not found`);
    }

    // Remove directory from the store
    const transaction = this.db.transaction(
      this.directoriesStoreName,
      'readwrite'
    );
    const store = transaction.objectStore(this.directoriesStoreName);
    await store.delete(directoryTitle);

    // Update all notes that reference the deleted directory
    await this.updateNotesParent(directoryTitle, '');

    await transaction.done;
  }

  // Get notes by a specific directory
  async getNotesByDirectory(directoryTitle: string): Promise<Note[]> {
    const allNotes = await this.getAllNotes();
    return allNotes.filter((note) => note.parentName === directoryTitle);
  }
}
