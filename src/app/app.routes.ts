import { Route, Routes } from '@angular/router';
import { NotesComponent } from './features/notes/notes.component';
import { NotesSidebarComponent } from './features/notes/notes-sidebar/notes-sidebar.component';
export interface NamedRoute extends Route {
  systemName: string;
}

export const routes: NamedRoute[] = [
  { path: 'notes/:title', component: NotesComponent, systemName: 'edit-note' },
  {
    path: 'notes',
    component: NotesSidebarComponent,
    systemName: 'browse-files-in-directory',
  },
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full',
    systemName: 'default-route-reditect',
  },
];
