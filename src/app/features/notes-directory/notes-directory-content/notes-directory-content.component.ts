import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Component, computed, inject } from '@angular/core';
import { NotesStoreService } from '../../notes/notes-store.service';
import { DEFAULT_NOTE_TITLE } from '../../../core/navigationVariables';

@Component({
  imports: [CommonModule, CdkDrag, CdkDropList, CdkDropListGroup],
  selector: 'app-notes-directory-content',
  templateUrl: './notes-directory-content.component.html',
  styleUrls: ['./notes-directory-content.component.css'],
})
export class NotesDirectoryContentComponent {
  notesStoreService = inject(NotesStoreService);

  directories = computed(() => {
    return this.notesStoreService.getGroupedNotes();
  }) as any;
  toggleCollapse(directory: any) {
    directory.collapsed = !directory.collapsed;
  }

  onDragStart(event: DragEvent, file: string) {
    event.dataTransfer?.setData('file', file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.getData('file');
    if (file) {
      console.log('ddddd');
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  drop(event: CdkDragDrop<string[]>) {
    let movedNoteParentTitle = event.container.data as any;

    //TODO: move this to const, add reload after adding new note, fix flickerign
    if (movedNoteParentTitle === 'undefined~title') {
      movedNoteParentTitle = null;
    }
    const newNote = {
      ...event.item.data,
      parentTitle: movedNoteParentTitle,
    };
    this.notesStoreService.updateNote(newNote);
  }
}
