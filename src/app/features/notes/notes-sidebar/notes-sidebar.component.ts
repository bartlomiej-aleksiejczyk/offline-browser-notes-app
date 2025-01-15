import { Component, OnInit } from '@angular/core';
import { NoteSummary } from '../../../core/models/note-summary.model';
import { NotesStoreService } from '../notes-store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes-sidebar',
  templateUrl: './notes-sidebar.component.html',
  styleUrls: ['./notes-sidebar.component.css'],
  imports: [CommonModule],
})
export class NotesSidebarComponent implements OnInit {
  notes: NoteSummary[] = [];

  constructor(private notesStore: NotesStoreService) {}

  ngOnInit(): void {
    this.notesStore.notesList$.subscribe((notes) => {
      this.notes = notes;
    });

    this.notesStore.fetchNotes();
  }

  selectNote(title: string): void {
    this.notesStore.selectNote(title);
  }

  loadMoreNotes(): void {
    this.notesStore.nextPage();
  }
}
