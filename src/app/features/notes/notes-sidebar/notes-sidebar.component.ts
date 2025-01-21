import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { NotesStoreService } from '../notes-store.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from '../../../core/models/note.model';
import { NoteRenameModalComponent } from '../note-rename-modal/note-rename-modal.component';
@Component({
  selector: 'app-notes-sidebar',
  templateUrl: './notes-sidebar.component.html',
  styleUrls: ['./notes-sidebar.component.css'],
  imports: [CommonModule, NoteRenameModalComponent],
})
export class NotesSidebarComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  notesStore = inject(NotesStoreService);
  editedTitleName = signal<string | null>(null);
  titleFromUrl = signal<string | null>(null);

  constructor() {
    this.route.paramMap.subscribe((paramMap) => {
      const title = paramMap.get('title');
      this.titleFromUrl.set(title);
    });
    effect(() => {
      const titleFromDb = this.notesStore.selectedNoteTitle$();

      if (this.titleFromUrl() !== null) {
        this.notesStore.selectNote(this.titleFromUrl() as string);
      }
      if (titleFromDb && !this.titleFromUrl()) {
        this.router.navigate(['/notes', titleFromDb]);
      }
    });
  }
  ngOnInit(): void {
    const titleFromUrl = this.titleFromUrl();

    if (titleFromUrl) {
      this.notesStore.selectNote(titleFromUrl);
    }
  }

  async addNewNote(position: 'start' | 'end' | number = 'end'): Promise<void> {
    await this.notesStore.addNewNote(position);
  }

  async updateNote(note: Note): Promise<void> {
    await this.notesStore.updateNote(note);
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
      this.router.navigate(['/notes', title]);
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

  async renameNote(event: { oldTitle: string; newTitle: string }) {
    this.editedTitleName.set(null);
    const notes = this.notesStore.notesList$();
    const oldNote = notes.find((note) => note.title === event.oldTitle);

    if (!oldNote) {
      throw new Error('Unknown error when renaming note');
    }
    const renamedNote = { ...oldNote, title: event.newTitle };
    // TODO: Add graceful fail when wrong title
    await this.notesStore.updateNote(renamedNote);
    await this.notesStore.deleteNote(oldNote.title);
    if (this.titleFromUrl() === event.oldTitle) {
      this.router.navigate(['/notes', event.newTitle]);
    }
  }
}
