import { Component, OnInit } from '@angular/core';
import { NoteSummary } from '../../../core/models/note-summary.model';
import { PersistanceService } from '../../../core/services/persistance.service';
@Component({
  selector: 'app-notes-sidebar',
  imports: [],
  templateUrl: './notes-sidebar.component.html',
  styleUrl: './notes-sidebar.component.css',
})
export class NotesSidebarComponent implements OnInit {
  notes: NoteSummary[] = [];

  constructor(private persistanceService: PersistanceService) {}

  async ngOnInit(): Promise<void> {
    const allNotes = await this.persistanceService.getPaginatedNotes();
    this.notes = allNotes.notesSummaries;
  }
}
