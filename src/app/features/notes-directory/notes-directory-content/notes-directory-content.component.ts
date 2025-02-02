import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Component, computed, effect, inject } from '@angular/core';
import { NotesStoreService } from '../../notes/notes-store.service';

@Component({
  imports: [CommonModule, CdkDrag, CdkDropList],
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
      console.log('ddddd')
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
