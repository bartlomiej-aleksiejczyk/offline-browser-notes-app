import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteSummary } from '../../core/models/note-summary.model';
import { PersistanceService } from '../../core/services/persistance.service';
import { NotesPage } from '../../core/models/notes-page.model';
import { Note } from '../../core/models/note.model';
import { NotesSidebarComponent } from './notes-sidebar/notes-sidebar.component';
import { NoteDisplayComponent } from './note-display/note-display.component';
import { MainNavbarComponent } from '../main-navbar/main-navbar.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  host: { class: 'notes-wrapper' },
  imports: [CommonModule, NotesSidebarComponent, NoteDisplayComponent],
})
export class NotesComponent {}
