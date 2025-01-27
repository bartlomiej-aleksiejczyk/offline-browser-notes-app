import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'app-notes-directory-content',
  templateUrl: './notes-directory-content.component.html',
  styleUrls: ['./notes-directory-content.component.css'],
})
export class NotesDirectoryContentComponent {
  directories = [
    {
      title: 'Directory 1',
      collapsed: false,
      files: ['File 1.1', 'File 1.2', 'File 1.3'],
    },
    {
      title: 'Directory 2',
      collapsed: true,
      files: ['File 2.1', 'File 2.2'],
    },
  ];

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
