import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesSidebarComponent } from './notes-sidebar/notes-sidebar.component';
import { NoteDisplayComponent } from './note-display/note-display.component';
import { DevicePreferencesService } from '../../core/services/device-preferences.service';
import { DefaultNoteDisplayComponent } from './default-note-display/default-note-display.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
  host: { class: 'notes-wrapper' },
  imports: [
    CommonModule,
    NotesSidebarComponent,
    NoteDisplayComponent,
    DefaultNoteDisplayComponent,
  ],
})
export class NotesComponent {
  devicePreferencesService = inject(DevicePreferencesService);
}
