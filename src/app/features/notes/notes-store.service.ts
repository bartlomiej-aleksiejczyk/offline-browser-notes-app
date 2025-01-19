import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { PersistanceService } from '../../core/services/persistance.service';
import { Note } from '../../core/models/note.model';
import { find } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotesStoreService {
  private notesList = signal<Note[]>([]);
  private selectedNoteTitle = signal<string | null>(null);
  private selectedNote = signal<Note | null>(null);

  notesList$ = computed(() => this.notesList());
  selectedNoteTitle$ = computed(() => this.selectedNoteTitle());
  selectedNote$ = computed(() => this.selectedNote());

  persistanceService = inject(PersistanceService);

  constructor() {
    effect(() => {
      this.initializeStore();
    });
  }

  private async initializeStore(): Promise<void> {
    await this.loadAllNotes();
    await this.loadSelectedNoteTitle();

    if (!this.selectedNoteTitle() && this.notesList().length > 0) {
      this.selectNote(this.notesList()[0].title);
    }
    await this.loadSelectedNote();
  }

  private isValidTitle(title: string): boolean {
    const regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(title);
  }

  private async loadAllNotes(): Promise<void> {
    try {
      const notes = await this.persistanceService.getSortedNotes();
      if (notes.length === 0) {
        await this.addNewNote();
      } else {
        this.notesList.set(notes);
      }
    } catch (error) {
      console.error('Error loading all notes:', error);
    }
  }

  private async loadSelectedNoteTitle(): Promise<void> {
    try {
      const selectedNoteTitle = await this.persistanceService.getSelectedNote();
      this.selectedNoteTitle.set(selectedNoteTitle);
    } catch (error) {
      console.error('Error loading selected note:', error);
    }
  }

  // This function has to be executed after loading selected note settings and all notes list
  // TODO: Prevent executing this function before loading mentioned values
  private async loadSelectedNote(): Promise<void> {
    try {
      const note = this.notesList().find(
        (note) => note.title === this.selectedNoteTitle()
      );
      this.selectedNote.set(note || null);
    } catch (error) {
      console.error('Error loading selected note:', error);
    }
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
      console.error('Error moving note:', error);
    }
  }

  async selectNote(title: string): Promise<void> {
    this.selectedNoteTitle.set(title);
    await this.persistanceService.setSelectedNote(title);
    await this.loadSelectedNote();
  }
}
