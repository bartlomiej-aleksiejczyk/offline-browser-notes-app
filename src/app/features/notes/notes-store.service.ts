import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NoteSummary } from '../../core/models/note-summary.model';
import { PersistanceService } from '../../core/services/persistance.service';
import { Note } from '../../core/models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NotesStoreService {
  private notesListSubject = new BehaviorSubject<NoteSummary[]>([]);
  private selectedNoteTitleSubject = new BehaviorSubject<string | null>(null);
  private currentPage = 0;
  private pageSize = 1000;
  private hasMore = false;

  constructor(private persistanceService: PersistanceService) {}

  get notesList$(): Observable<NoteSummary[]> {
    return this.notesListSubject.asObservable();
  }

  get selectedNoteTitle$(): Observable<string | null> {
    return this.selectedNoteTitleSubject.asObservable();
  }

  async fetchNotes(): Promise<void> {
    const { notesSummaries, hasMore } =
      await this.persistanceService.getPaginatedNotes(this.pageSize, 0);
    this.notesListSubject.next(notesSummaries);
    this.hasMore = hasMore;
    this.currentPage = 0;
  }

  async loadPage(page: number): Promise<void> {
    const offset = page * this.pageSize;
    const { notesSummaries, hasMore } =
      await this.persistanceService.getPaginatedNotes(this.pageSize, offset);

    const updatedNotes =
      page === 0
        ? notesSummaries
        : [...this.notesListSubject.value, ...notesSummaries];
    this.notesListSubject.next(updatedNotes);
    this.hasMore = hasMore;
    this.currentPage = page;
  }

  async nextPage(): Promise<void> {
    if (this.hasMore) {
      await this.loadPage(this.currentPage + 1);
    }
  }

  async addNewNote(position: 'start' | 'end' | number = 'end'): Promise<void> {
    const newNote: Omit<Note, 'index'> = {
      title: `Note ${Date.now()}`,
      content: 'This is the content of the new note.',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.persistanceService.addNote(newNote, position);
    await this.fetchNotes();
  }

  async updateNote(note: Note): Promise<void> {
    await this.persistanceService.updateNote(note);
    await this.fetchNotes();
  }

  async moveNote(title: string, index: number): Promise<void> {
    try {
      await this.persistanceService.reorderNote(title, index);
      await this.fetchNotes();
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
