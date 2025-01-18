import { Routes } from '@angular/router';
import { NotesComponent } from './features/notes/notes.component';

export const routes: Routes = [
  { path: 'notes/:title', component: NotesComponent },
  { path: 'notes', component: NotesComponent },
  { path: '', redirectTo: 'notes', pathMatch: 'full' },
];
