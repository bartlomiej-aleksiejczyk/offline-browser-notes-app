import { Component, OnInit } from '@angular/core';
import { NoteSummary } from '../../../core/models/note-summary.model';
import { NotesStoreService } from '../notes-store.service';
import { CommonModule } from '@angular/common';
import { Note } from '../../../core/models/note.model';
import { not } from 'rxjs/internal/util/not';

@Component({
  selector: 'app-notes-sidebar',
  templateUrl: './notes-sidebar.component.html',
  styleUrls: ['./notes-sidebar.component.css'],
  imports: [CommonModule],
})
export class NotesSidebarComponent implements OnInit {
  notes: Note[] = [];
  selectedNoteTitle: string | null = null;

  constructor(private notesStore: NotesStoreService) {}

  ngOnInit(): void {
    this.notesStore.notesList$.subscribe((notes) => {
      this.notes = notes;
    });
    this.notesStore.selectedNoteTitle$.subscribe((title) => {
      this.selectedNoteTitle = title;
    });
    this.notesStore.loadAllNotes();
    this.notesStore.loadSelectedNote();
  }

  selectNote(title: string): void {
    this.notesStore.selectNote(title);
  }

  async addNewNote(position: 'start' | 'end' | number = 'end'): Promise<void> {
    await this.notesStore.addNewNote(position);
  }

  async updateNote(note: Note): Promise<void> {
    await this.notesStore.updateNote(note);
  }

  async moveNote(noteId: string, index: number) {
    try {
      await this.notesStore.moveNote(noteId, index);
    } catch (error) {
      console.error(error);
    }
  }

  async updateSelectedNote(title: string): Promise<void> {
    try {
      await this.notesStore.selectNote(title);
      console.log(`Selected note updated to: ${title}`);
    } catch (error) {
      console.error('Error updating selected note:', error);
    }
  }
}
