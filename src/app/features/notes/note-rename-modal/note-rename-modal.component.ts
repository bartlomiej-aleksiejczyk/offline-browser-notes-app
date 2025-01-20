import { Component, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotesStoreService } from '../notes-store.service';

@Component({
  selector: 'app-note-rename-modal',
  imports: [FormsModule],
  templateUrl: './note-rename-modal.component.html',
  styleUrl: './note-rename-modal.component.css',
})
export class NoteRenameModalComponent {
  private readonly router = inject(Router);
  notesStore = inject(NotesStoreService);
  oldName = input.required<string>();
  newName = model<string>('');
  onNameChangeAccept = output<string>();
  onNameChangeCancel = output<void>();

  ngOnInit() {
    this.newName.set(this.oldName());
  }

  onAccept() {
    this.onNameChangeAccept.emit(this.newName());
  }

  onCancel() {
    this.newName.set(this.oldName())
    this.onNameChangeCancel.emit();
  }
}
