import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotesStoreService } from '../notes-store.service';

@Component({
  selector: 'app-note-rename-modal',
  imports: [],
  templateUrl: './note-rename-modal.component.html',
  styleUrl: './note-rename-modal.component.css',
})
export class NoteRenameModalComponent {
  private readonly router = inject(Router);
  notesStore = inject(NotesStoreService);
  oldName = input.required<string>();
  newName = signal('');

  ngOnInit() {
    this.newName.set(this.oldName());
  }

  onAccept() {
    this.rename.emit(this.newName); // Emit the new name
  }

  onCancel() {
    this.cancel.emit();
  }
}
