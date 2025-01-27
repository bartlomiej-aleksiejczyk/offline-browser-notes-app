import { Route, Routes } from '@angular/router';
import { NotesComponent } from './features/notes/notes.component';
import { NotesSidebarComponent } from './features/notes/notes-sidebar/notes-sidebar.component';
import { FileExplorerComponent } from './features/file-explorer/file-explorer.component';
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
    path: 'explore',
    component: FileExplorerComponent,
    systemName: 'explore-files',
  },
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full',
    systemName: 'default-route-reditect',
  },
];
