import { Component, OnInit, computed } from '@angular/core';
import { NoteSummary } from '../../../core/models/note-summary.model';
import { map } from 'rxjs/operators';
import { NotesStoreService } from '../notes-store.service';
import { CommonModule } from '@angular/common';
import { Note } from '../../../core/models/note.model';

import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-notes-sidebar',
  templateUrl: './notes-sidebar.component.html',
  styleUrls: ['./notes-sidebar.component.css'],
  imports: [CommonModule],
})
export class NotesSidebarComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  constructor(private notesStore: NotesStoreService) {}

  ngOnInit(): void {
    this.notesStore.loadAllNotes();
    this.notesStore.loadSelectedNote();

    const titleFromUrl = this.route.snapshot.paramMap.get('title');

    const notes = this.notesStore.notesList$();
    const selectedNoteTitle = this.notesStore.selectedNoteTitle$();

    let newTitle = '';

    if (!titleFromUrl && !selectedNoteTitle) {
      newTitle = notes[0]?.title || '';
    } else if (!titleFromUrl && selectedNoteTitle) {
      newTitle = selectedNoteTitle;
    } else if (titleFromUrl) {
      newTitle = titleFromUrl;
    }

    this.notesStore.selectNote(newTitle);
    this.selectNewNote(newTitle);
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

  async selectNewNote(title: string): Promise<void> {
    try {
      await this.notesStore.selectNote(title);
      console.log(`Selected note updated to: ${title}`);
    } catch (error) {
      console.error('Error updating selected note:', error);
    }
  }
}
