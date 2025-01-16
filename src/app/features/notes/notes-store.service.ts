import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersistanceService } from '../../core/services/persistance.service';
import { Note } from '../../core/models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NotesStoreService {
  private notesListSubject = new BehaviorSubject<Note[]>([]);
  private selectedNoteTitleSubject = new BehaviorSubject<string | null>(null);

  constructor(private persistanceService: PersistanceService) {}

  get notesList$(): Observable<Note[]> {
    return this.notesListSubject.asObservable();
  }

  get selectedNoteTitle$(): Observable<string | null> {
    return this.selectedNoteTitleSubject.asObservable();
  }

  async addDefaultNote(): Promise<void> {
    const defaultNote: Omit<Note, 'index'> = {
      title: 'Default Note',
      content: 'This is the default note content.',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.persistanceService.addNote(defaultNote, 'start');
    await this.loadAllNotes();
  }

  async loadAllNotes(): Promise<void> {
    const notes = await this.persistanceService.getSortedNotes();

    this.notesListSubject.next(notes);
  }

  async addNewNote(position: 'start' | 'end' | number = 'end'): Promise<void> {
    const newNote: Omit<Note, 'index'> = {
      title: `Note ${Date.now()}`,
      content: 'This is the content of the new note.',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.persistanceService.addNote(newNote, position);
    await this.loadAllNotes();
  }

  async updateNote(note: Note): Promise<void> {
    await this.persistanceService.updateNote(note);
    await this.loadAllNotes();
  }

  async moveNote(title: string, index: number): Promise<void> {
    try {
      await this.persistanceService.reorderNote(title, index);
      await this.loadAllNotes();
    } catch (error) {
      console.error(error);
    }
  }

  async selectNote(title: string): Promise<void> {
    this.selectedNoteTitleSubject.next(title);
    await this.persistanceService.setSelectedNote(title);
  }

  async fetchSelectedNote(): Promise<void> {
    try {
      const selectedNote = await this.persistanceService.getSelectedNote();
      this.selectedNoteTitleSubject.next(selectedNote);
    } catch (error) {
      console.error('Error fetching selected note:', error);
    }
  }
}
