import { Component, inject } from '@angular/core';
import { NotesStoreService } from '../notes-store.service';
import { NotesDirectoryContentComponent } from './notes-directory-content/notes-directory-content.component';
import { NotesDirectorySidebarComponent } from './notes-directory-sidebar/notes-directory-sidebar.component';
import { DevicePreferencesService } from '../../../core/services/device-preferences.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [
    NotesDirectoryContentComponent,
    NotesDirectorySidebarComponent,
    CommonModule,
  ],
  selector: 'app-notes-directory',
  templateUrl: './notes-directory.component.html',
  styleUrls: ['./notes-directory.component.css'],
  host: { class: 'notes-directory' },
})
export class NotesDirectoryComponent {
  notesStoreService = inject(NotesStoreService);
  devicePreferencesService = inject(DevicePreferencesService);

  get directories() {
    return this.notesStoreService.getDirectories();
  }

  async createNewDirectory(directoryTitle: string) {
    if (!directoryTitle) {
      alert('Directory name cannot be empty!');
      return;
    }

    await this.notesStoreService.createNewDirectory(directoryTitle);
  }

  async renameDirectory(oldTitle: string, newTitle: string) {
    if (!newTitle) {
      alert('Directory name cannot be empty!');
      return;
    }

    await this.notesStoreService.renameDirectory(oldTitle, newTitle);
  }

  async deleteDirectory(directoryTitle: string) {
    const confirmRemove = confirm(
      `Are you sure you want to remove the directory "${directoryTitle}"?`
    );
    if (confirmRemove) {
      await this.notesStoreService.deleteDirectory(directoryTitle);
    }
  }
}
