import { Routes } from '@angular/router';
import { NotesComponent } from './features/notes/notes.component';
import { NotesSidebarComponent } from './features/notes/notes-sidebar/notes-sidebar.component';

export const routes: Routes = [
  { path: 'notes/:title', component: NotesComponent },
  { path: 'notes', component: NotesSidebarComponent },
  { path: '', redirectTo: 'notes', pathMatch: 'full' },
];
