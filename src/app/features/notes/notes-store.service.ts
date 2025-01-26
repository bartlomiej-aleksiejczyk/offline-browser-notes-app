import { Injectable, signal, effect, inject } from '@angular/core';
import { PersistanceService } from '../../core/services/persistance.service';
import { Note } from '../../core/models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NotesStoreService {
  private notesList = signal<Note[]>([]);
  private selectedNoteTitle = signal<string | null>(null);
  private selectedNote = signal<Note | null>(null);
  private readonly persistanceService = inject(PersistanceService);

  constructor() {
    effect(() => {
      this.initializeStore();
    });
  }

  // TODO: Add db checking to the getters
  getSelectedNoteTitle() {
    return this.selectedNoteTitle();
  }

  getNotesList() {
    return this.notesList();
  }

  getSelectedNote(): Note | null {
    return this.selectedNote();
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

  //TODO: spearate initialization and stale cache refresh
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

  private updateSelectedNote(notes: Note[]): void {
    const note = this.notesList().find(
      (note) => note.title === this.selectedNoteTitle()
    );
  }

  private async loadSelectedNoteTitle(): Promise<void> {
    try {
      const selectedNoteTitle =
        await this.persistanceService.getSelectedNoteTitle();
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
    await this.loadSelectedNoteTitle();
    await this.loadSelectedNote();
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

  async deleteNote(title: string): Promise<void> {
    try {
      await this.persistanceService.deleteNote(title);
      await this.loadAllNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }
}
