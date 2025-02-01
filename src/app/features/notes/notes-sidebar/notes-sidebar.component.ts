import { Component, inject, signal } from '@angular/core';
import { NotesStoreService } from '../notes-store.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NoteRenameModalComponent } from '../note-rename-modal/note-rename-modal.component';
import { DevicePreferencesService } from '../../../core/services/device-preferences.service';
import { DEFAULT_NOTE_TITLE } from '../../../core/navigationVariables';
import { SearchableSelectComponent } from '../../../shared/searchable-select/searchable-select.component';

@Component({
  selector: 'app-notes-sidebar',
  templateUrl: './notes-sidebar.component.html',
  styleUrls: ['./notes-sidebar.component.css'],
  imports: [CommonModule, NoteRenameModalComponent, SearchableSelectComponent],
})
export class NotesSidebarComponent {
  private readonly router = inject(Router);
  notesStore = inject(NotesStoreService);
  devicePreferencesService = inject(DevicePreferencesService);
  editedTitleName = signal<string | null>(null);
  defaultNoteTitle = DEFAULT_NOTE_TITLE;

  async addNewNote(position: 'start' | 'end' | number = 'end'): Promise<void> {
    await this.notesStore.addNewNote(position);
  }

  async moveNote(noteId: string, index: number) {
    try {
      await this.notesStore.moveNote(noteId, index);
    } catch (error) {
      console.error(error);
    }
  }

  async selectNewNote(title: string): Promise<void> {
    try {
      if (this.devicePreferencesService.isMobile()) {
        this.notesStore.selectNote(title);
      } else {
        this.router.navigate(['/notes', title]);
      }
    } catch (error) {
      console.error('Error updating selected note:', error);
    }
  }
  async deleteNote(title: string): Promise<void> {
    try {
      if (confirm('Are you sure to delete note named: ' + title)) {
        await this.notesStore.deleteNote(title);
      }
    } catch (error) {
      console.error('Error deleting selected note:', error);
    }
  }

  updateEditedTitleName(title: string) {
    this.editedTitleName.set(title);
  }

  clearEditedTitleName() {
    this.editedTitleName.set(null);
  }

  // TODO: move this to the centralised service store
  async renameNote(event: { oldTitle: string; newTitle: string }) {
    this.editedTitleName.set(null);
    const notes = this.notesStore.getNotesList();
    const oldNote = notes.find((note) => note.title === event.oldTitle);

    if (!oldNote) {
      throw new Error('Unknown error when renaming note');
    }
    const renamedNote = { ...oldNote, title: event.newTitle };
    // TODO: Add graceful fail when a wrong title error occurs
    await this.notesStore.updateNote(renamedNote);
    await this.notesStore.deleteNote(oldNote.title);

    if (this.notesStore.getSelectedNoteTitle() === event.oldTitle) {
      await this.notesStore.selectNote(event.newTitle);
    }
  }

  onSelectDirectory(event: string | null) {
    this.notesStore.setSelectedDirectoryTitle(event);
  }
}
