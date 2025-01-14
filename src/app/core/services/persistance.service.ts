import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Note } from '../models/note.model';

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

  async addNote(note: Note): Promise<void> {
    await this.db.add(this.storeName, note);
  }

  async updateNote(note: Note): Promise<void> {
    await this.db.put(this.storeName, note);
  }

  async deleteNote(id: string): Promise<void> {
    await this.db.delete(this.storeName, id);
  }

  async getNoteById(id: string): Promise<Note | undefined> {
    return await this.db.get(this.storeName, id);
  }

  async getAllNotes(): Promise<Note[]> {
    return await this.db.getAll(this.storeName);
  }
}
