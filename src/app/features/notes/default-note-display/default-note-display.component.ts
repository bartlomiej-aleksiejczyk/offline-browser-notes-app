import { Component, inject } from '@angular/core';
import { NotesStoreService } from '../notes-store.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-default-note-display',
  imports: [FormsModule, TextFieldModule, CommonModule],
  templateUrl: './default-note-display.component.html',
  styleUrl: './default-note-display.component.css',
})
export class DefaultNoteDisplayComponent {
  notesStore = inject(NotesStoreService);
}
