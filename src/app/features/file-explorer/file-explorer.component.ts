
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { FileNode } from '../../core/models/file-node.model';
import { DevicePreferencesService } from '../../core/services/device-preferences.service';
import { FileExplorerStoreService } from './file-explorer-store.service';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrl:'./file-explorer.component.css',
})
export class FileExplorerComponent implements OnInit {
  store = inject(FileExplorerStoreService);
  private readonly devicePreferencesService = inject(DevicePreferencesService);

  files = signal<FileNode[] | null>(null);
  selectedFiles: FileNode[] = [];
  breadcrumb = computed(() => this.generateBreadcrumb());
  isMobile = this.devicePreferencesService.isMobile();

  ngOnInit() {
    this.files.set(this.store.files()); 
    this.store.loadAllFiles();
  }

  toggleFileSelection(file: FileNode) {
    const index = this.selectedFiles.indexOf(file);
    if (index > -1) {
      this.selectedFiles.splice(index, 1);
    } else {
      this.selectedFiles.push(file);
    }
  }

  deleteSelectedFiles() {
    this.selectedFiles.forEach((file) => this.store.deleteFile(file.id));
    this.selectedFiles = [];
  }

  moveSelectedFiles() {
    // Implement logic to move files (e.g., show a folder picker)
  }

  copySelectedFiles() {
    // Implement logic to copy files
  }

  generateBreadcrumb(): { id: string; name: string }[] {
    // Mock implementation: Replace this with actual breadcrumb generation logic
    return [{ id: 'root', name: 'Root' }, { id: 'folder1', name: 'Folder 1' }];
  }
}
