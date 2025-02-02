import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesStoreService } from '../../notes/notes-store.service';

@Component({
  imports: [CommonModule],
  selector: 'app-notes-directory-sidebar',
  templateUrl: './notes-directory-sidebar.component.html',
  styleUrls: ['./notes-directory-sidebar.component.css'],
})
export class NotesDirectorySidebarComponent {
  notesStoreService = inject(NotesStoreService);

  directories = computed(() => this.notesStoreService.getDirectories()); // Get the directories from the store service

  // Create a new directory
  async createDirectory() {
    const directoryName = prompt('Enter new directory name:');
    if (directoryName) {
      await this.notesStoreService.createNewDirectory(directoryName);
    }
  }

  // Rename an existing directory
  async renameDirectory(oldTitle: string) {
    const newTitle = prompt(`Enter new name for directory "${oldTitle}":`);
    if (newTitle && newTitle !== oldTitle) {
      await this.notesStoreService.renameDirectory(oldTitle, newTitle);
    }
  }

  // Remove an existing directory
  async deleteDirectory(directoryTitle: string) {
    const confirmRemove = confirm(
      `Are you sure you want to remove the directory "${directoryTitle}"?`
    );
    if (confirmRemove) {
      await this.notesStoreService.deleteDirectory(directoryTitle);
    }
  }
}
