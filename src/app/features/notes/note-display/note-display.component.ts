import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesStoreService } from '../notes-store.service';
import { Note } from '../../../core/models/note.model';
@Component({
  imports: [FormsModule],
  selector: 'app-note-display',
  templateUrl: './note-display.component.html',
  styleUrls: ['./note-display.component.css'],
})
export class NoteDisplayComponent {
  notesStore = inject(NotesStoreService);

  get noteContent(): string {
    return this.notesStore.selectedNote$()?.content || '';
  }

  // Update the selected note's content
  set noteContent(value: string) {
    const selectedNote = this.notesStore.selectedNote$();
    if (selectedNote) {
      this.notesStore.updateNote({ ...selectedNote, content: value });
    }
  }
}
