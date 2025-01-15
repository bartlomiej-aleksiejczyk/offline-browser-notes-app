import { Component, OnInit } from '@angular/core';
import { NotesStoreService } from '../notes-store.service';

@Component({
  selector: 'app-note-display',
  templateUrl: './note-display.component.html',
  styleUrls: ['./note-display.component.css'],
})
export class NoteDisplayComponent implements OnInit {
  selectedNoteTitle: string | null = null;

  constructor(private notesStore: NotesStoreService) {}

  ngOnInit(): void {
    this.notesStore.selectedNoteTitle$.subscribe((title) => {
      this.selectedNoteTitle = title;
    });

    this.notesStore.fetchSelectedNote();
  }
}
