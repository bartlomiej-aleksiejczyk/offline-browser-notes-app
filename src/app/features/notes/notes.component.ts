import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteSummary } from '../../core/models/note-summary.model';
import { PersistanceService } from '../../core/services/persistance.service';
import { NotesPage } from '../../core/models/notes-page.model';
import { Note } from '../../core/models/note.model';
import { NotesSidebarComponent } from './notes-sidebar/notes-sidebar.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  imports: [CommonModule, NotesSidebarComponent],
})
export class NotesComponent implements OnInit {
  notes: NoteSummary[] = [];
  currentPage = 0;
  pageSize = 1000;
  hasMore = false;

  constructor(private persistanceService: PersistanceService) {}

  async ngOnInit(): Promise<void> {
    const page = await this.loadPage(0);
    this.notes = page.notesSummaries;
    this.hasMore = page.hasMore;
    if (this.notes.length === 0) this.addNewNote();
  }

  async loadPage(page: number): Promise<NotesPage> {
    const offset = page * this.pageSize;
    return await this.persistanceService.getPaginatedNotes(
      this.pageSize,
      offset
    );
  }

  async nextPage(): Promise<void> {
    if (this.hasMore) {
      const page = await this.loadPage(this.currentPage + 1);
      this.notes.push(...page.notesSummaries);
      this.hasMore = page.hasMore;
      this.currentPage++;
    }
  }

  async addNewNote(position: 'start' | 'end' | number = 'end'): Promise<void> {
    const newNote: Omit<Note, 'index'> = {
      title: 'A New Note',
      content: 'This is the content of the new note.',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.persistanceService.addNote(newNote, position);
  }

  async updateNote(note: Note): Promise<void> {
    await this.persistanceService.updateNote(note);
  }

  async moveNote(noteId: string, index: number) {
    try {
      await this.persistanceService.reorderNote(noteId, index);
    } catch (error) {
      console.error(error);
    }
  }

  async updateSelectedNote(title: string): Promise<void> {
    try {
      await this.persistanceService.setSelectedNote(title);
      console.log(`Selected note updated to: ${title}`);
    } catch (error) {
      console.error('Error updating selected note:', error);
    }
  }

  async fetchSelectedNote(): Promise<void> {
    try {
      const selectedNote = await this.persistanceService.getSelectedNote();
      if (selectedNote) {
        console.log(`Currently selected note: ${selectedNote}`);
      } else {
        console.log('No note is currently selected.');
      }
    } catch (error) {
      console.error('Error fetching selected note:', error);
    }
  }
}
