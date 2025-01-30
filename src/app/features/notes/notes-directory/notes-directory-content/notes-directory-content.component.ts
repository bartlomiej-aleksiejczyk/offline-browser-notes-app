import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { NotesStoreService } from '../../notes-store.service';

@Component({
  imports: [CommonModule],
  selector: 'app-notes-directory-content',
  templateUrl: './notes-directory-content.component.html',
  styleUrls: ['./notes-directory-content.component.css'],
})
export class NotesDirectoryContentComponent {
  notesStoreService = inject(NotesStoreService);
  constructor() {
    effect(() => {
      console.log('dirs', this.directories());
    });
  }
  directories = computed(() => {
    console.log(this.notesStoreService.getGroupedNotes());
    return this.notesStoreService.getGroupedNotes();
  }) as any;
  toggleCollapse(directory: any) {
    directory.collapsed = !directory.collapsed;
  }

  onDragStart(event: DragEvent, file: string) {
    event.dataTransfer?.setData('file', file);
  }

  // Handle file drop logic here
  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.getData('file');
    if (file) {
      console.log(`Dropped file: ${file}`);
      // Implement your drop logic
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
}
