import { Injectable, signal, computed, effect } from '@angular/core';
import { PersistanceService } from '../../core/services/persistance.service';
import { Note } from '../../core/models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NotesStoreService {
  private notesList = signal<Note[]>([]);
  private selectedNoteTitle = signal<string | null>(null);

  constructor(private persistanceService: PersistanceService) {}

  notesList$ = computed(() => this.notesList());
  selectedNoteTitle$ = computed(() => this.selectedNoteTitle());

  private isValidTitle(title: string): boolean {
    const regex = /^[a-zA-Z-_]+$/;
    return regex.test(title);
  }

  async loadAllNotes(): Promise<void> {
    const notes = await this.persistanceService.getSortedNotes();
    if (notes.length === 0) {
      await this.addNewNote();
    }
    this.notesList.set(notes);
  }

  async addNewNote(position: 'start' | 'end' | number = 'end'): Promise<void> {
    const newNote: Omit<Note, 'index'> = {
      title: `Note-${Date.now()}`,
      content: 'This is the content of the new note.',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.persistanceService.addNote(newNote, position);
    await this.loadAllNotes();
  }

  async updateNote(note: Note): Promise<void> {
    if (!this.isValidTitle(note.title)) {
      throw new Error(
        `A note with the title "${note.title}" contains forbidden characters`
      );
    }
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
    this.selectedNoteTitle.set(title);
    await this.persistanceService.setSelectedNote(title);
  }

  async loadSelectedNote(): Promise<void> {
    try {
      const selectedNote = await this.persistanceService.getSelectedNote();
      this.selectedNoteTitle.set(selectedNote);
    } catch (error) {
      console.error('Error fetching selected note:', error);
    }
  }
}
