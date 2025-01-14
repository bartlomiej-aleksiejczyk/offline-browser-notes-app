import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Note } from '../models/note.model';
import { NoteSummary } from '../models/note-summary.model';
import { NotesPage } from '../models/notes-page.model';

@Injectable({
  providedIn: 'root',
})
export class PersistanceService {
  private dbName = 'NotesAppDB';
  private storeName = 'notes';
  private db!: IDBPDatabase;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    this.db = await openDB(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'id' });
        }
      },
    });
  }

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

    const transaction = this.db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);

    for (const noteToShift of allNotes.filter((n) => n.index >= insertIndex)) {
      noteToShift.index++;
      await store.put(noteToShift);
    }

    const newNote: Note = { ...note, index: insertIndex };
    await store.add(newNote);

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

    const transaction = this.db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);

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
    await this.db.put(this.storeName, note);
  }

  async deleteNote(title: string): Promise<void> {
    const allNotes = await this.getAllNotes();

    const noteToDelete = allNotes.find((note) => note.title === title);
    if (!noteToDelete) {
      throw new Error(`Note with title "${title}" not found`);
    }

    await this.db.delete(this.storeName, noteToDelete.id);

    await this.reorderNotes();
  }

  async getAllNotes(): Promise<Note[]> {
    return await this.db.getAll(this.storeName);
  }

  async getPaginatedNotes(limit = 1000, offset = 0): Promise<NotesPage> {
    const transaction = this.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('index');
    const notes: NoteSummary[] = [];
    let cursor = await index.openCursor();

    for (let i = 0; i < offset && cursor; i++) {
      cursor = await cursor.continue();
    }

    while (cursor && notes.length < limit) {
      const note = cursor.value;
      notes.push({ index: note.index, title: note.name });
      cursor = await cursor.continue();
    }

    const hasMore = !!cursor;

    return {
      notesSummaries: notes,
      limit: limit,
      offset: offset,
      hasMore: hasMore,
    };
  }
  private async reorderNotes(): Promise<void> {
    const allNotes = await this.getAllNotes();
    const sortedNotes = allNotes.sort((a, b) => a.index - b.index);

    const transaction = this.db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);

    for (let i = 0; i < sortedNotes.length; i++) {
      const note = sortedNotes[i];
      note.index = i + 1;
      await store.put(note);
    }
    await transaction.done;
  }
}
