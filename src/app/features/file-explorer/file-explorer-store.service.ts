import { effect, inject, Injectable, signal } from '@angular/core';
import { FileNode } from '../../core/models/file-node.model';
import { PersistanceService } from '../../core/services/persistance.service';

@Injectable({
  providedIn: 'root'
})
export class FileExplorerStoreService {
  private readonly persistanceService = inject(PersistanceService);
  files = signal<FileNode[] | null>(null);

  constructor() {
    this.loadAllFiles()
  }

  async loadAllFiles() {
    const newFiles = await this.persistanceService.getFiles()
    this.files.set(newFiles)
  }

  async addNewFile(file: FileNode){
    try {
        await this.persistanceService.addFile(file);
    } catch (error) {
      console.error('Error adding file:', error);
    }
  }
  async deleteFile(fileId: string){
    try {
        await this.persistanceService.deleteFile(fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
  async renameFile(fileId: string, newName: string){
    try {
        await this.persistanceService.renameFile(fileId, newName);
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  }
  async moveFile(fileId: string, newParentId: string | null){
    try {
        await this.persistanceService.moveFile(fileId, newParentId);
    } catch (error) {
      console.error('Error moving file:', error);
    }
  }
  }
