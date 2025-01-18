import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesStoreService } from '../notes-store.service';

@Component({
  imports: [FormsModule],
  selector: 'app-note-display',
  templateUrl: './note-display.component.html',
  styleUrls: ['./note-display.component.css'],
})
// TODO: fix signal misuse that works, understand why
export class NoteDisplayComponent {
  notesStore = inject(NotesStoreService);
  get noteContent(): string {
    return this.notesStore.selectedNote$()?.content || '';
  }

  set noteContent(value: string) {
    const selectedNote = this.notesStore.selectedNote$();
    if (selectedNote) {
      this.notesStore.updateNote({ ...selectedNote, content: value });
    }
  }
}
