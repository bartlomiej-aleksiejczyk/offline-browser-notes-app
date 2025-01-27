import { Component, inject } from '@angular/core';
import { NotesStoreService } from '../notes-store.service';
import { NotesDirectoryContentComponent } from './notes-directory-content/notes-directory-content.component';
import { NotesDirectorySidebarComponent } from './notes-directory-sidebar/notes-directory-sidebar.component';

@Component({
  imports: [NotesDirectoryContentComponent, NotesDirectorySidebarComponent],
  selector: 'app-notes-directory',
  templateUrl: './notes-directory.component.html',
  styleUrls: ['./notes-directory.component.css'],
  host: { class: 'notes-directory' },
})
export class NotesDirectoryComponent {
  notesStoreService = inject(NotesStoreService);

  // Get the list of directories from the NotesStoreService
  get directories() {
    return this.notesStoreService.getDirectories();
  }

  // Create a new directory using the NotesStoreService
  async createNewDirectory(directoryTitle: string) {
    if (!directoryTitle) {
      alert('Directory name cannot be empty!');
      return;
    }

    await this.notesStoreService.createNewDirectory(directoryTitle);
  }

  // Rename an existing directory
  async renameDirectory(oldTitle: string, newTitle: string) {
    if (!newTitle) {
      alert('Directory name cannot be empty!');
      return;
    }

    await this.notesStoreService.renameDirectory(oldTitle, newTitle);
  }

  // Remove an existing directory
  async removeDirectory(directoryTitle: string) {
    const confirmRemove = confirm(
      `Are you sure you want to remove the directory "${directoryTitle}"?`
    );
    if (confirmRemove) {
      await this.notesStoreService.removeDirectory(directoryTitle);
    }
  }
}
