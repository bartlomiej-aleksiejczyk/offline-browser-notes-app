import { Injectable, signal, effect, inject } from '@angular/core';
import { PersistanceService } from '../../core/services/persistance.service';
import { Note } from '../../core/models/note.model';
import { DEFAULT_NOTE_TITLE } from '../../core/navigationVariables';

@Injectable({
  providedIn: 'root',
})
export class NotesStoreService {
  private notesList = signal<Note[]>([]);
  private selectedNoteTitle = signal<string | null>(null);
  private selectedNote = signal<Note | null>(null);
  private directories = signal<string[]>([]);
  private groupedNotes = signal([]);
  private selectedDirectoryTitle = signal<string | null>(null);
  private readonly persistanceService = inject(PersistanceService);

  constructor() {
    //TODO: Remove this effect is redundant
    effect(() => {
      this.initializeStore();
    });
  }
  getSelectedDirectoryTitle() {
    return this.selectedDirectoryTitle();
  }

  getGroupedNotes() {
    return this.groupedNotes();
  }

  // TODO: Add db checking to the getters
  getSelectedNoteTitle() {
    return this.selectedNoteTitle();
  }

  getNotesList() {
    return this.notesList();
  }

  getSelectedNote(): Note | null {
    return this.selectedNote();
  }

  // Get all directories
  getDirectories() {
    return this.directories();
  }

  private async initializeStore(): Promise<void> {
    await this.loadAllNotes();
    await this.loadSelectedNoteTitle();
    await this.loadDirectories(); // Load directories
    if (!this.selectedNoteTitle()) {
      await this.selectDefaultNote();
    }
    await this.loadSelectedNote();
    await this.loadGroupedNotes();
  }

  private async loadAllNotes(): Promise<void> {
    try {
      let notes = [];
      if (this.selectedDirectoryTitle()) {
        notes = await this.persistanceService.getNotesByDirectory(
          this.selectedDirectoryTitle() as string
        );
      } else {
        notes = await this.persistanceService.getSortedNotes();
      }
      this.notesList.set(notes);
    } catch (error) {
      console.error('Error loading all notes:', error);
    }
  }

  private async loadSelectedNoteTitle(): Promise<void> {
    try {
      const selectedNoteTitle =
        await this.persistanceService.getSelectedNoteTitle();
      this.selectedNoteTitle.set(selectedNoteTitle);
    } catch (error) {
      console.error('Error loading selected note:', error);
    }
  }

  // This function has to be executed after loading selected note settings and all notes list
  // TODO: Prevent executing this function before loading mentioned values
  private async loadSelectedNote(): Promise<void> {
    try {
      const note = this.notesList().find(
        (note) => note.title === this.selectedNoteTitle()
      );
      this.selectedNote.set(note || null);
    } catch (error) {
      console.error('Error loading selected note:', error);
    }
  }

  // Load directories from PersistanceService
  private async loadDirectories(): Promise<void> {
    try {
      const directories = await this.persistanceService.getAllDirectoriesName();
      this.directories.set(directories);
    } catch (error) {
      console.error('Error loading directories:', error);
    }
  }

  async addNewNote(
    position: 'start' | 'end' | number = 'end',
    directory: string | null = null
  ): Promise<void> {
    const newNote: Omit<Note, 'index'> = {
      title: `Note-${Date.now()}`,
      content: 'This is the content of the new note.',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentTitle: directory ?? undefined, // Assign to directory if specified
    };

    await this.persistanceService.addNote(newNote, position);
    await this.loadAllNotes();
  }

  async updateNote(note: Note): Promise<void> {
    if (!this.isValidTitle(note.title)) {
      throw new Error(
        `A note with the title "${note.title}" contains forbidden characters`
      );
    }
    await this.persistanceService.updateNote(note);
    await this.loadAllNotes();
    await this.loadSelectedNoteTitle();
    await this.loadSelectedNote();
  }

  async moveNote(title: string, index: number): Promise<void> {
    try {
      await this.persistanceService.reorderNote(title, index);
      await this.loadAllNotes();
    } catch (error) {
      console.error('Error moving note:', error);
    }
  }

  async selectNote(title: string): Promise<void> {
    this.selectedNoteTitle.set(title);
    await this.persistanceService.setSelectedNote(title);
    await this.loadSelectedNote();
  }

  async selectDefaultNote(): Promise<void> {
    this.selectedNoteTitle.set(DEFAULT_NOTE_TITLE);
    await this.persistanceService.setSelectedNote(DEFAULT_NOTE_TITLE);
  }

  async deleteNote(title: string): Promise<void> {
    try {
      await this.persistanceService.deleteNote(title);
      await this.loadAllNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  async createNewDirectory(directoryTitle: string): Promise<void> {
    try {
      await this.persistanceService.addDirectory(directoryTitle);
      await this.loadDirectories();
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  }

  async renameDirectory(oldTitle: string, newTitle: string): Promise<void> {
    try {
      await this.persistanceService.updateDirectory(oldTitle, newTitle);
      await this.loadDirectories();
      await this.loadAllNotes();
    } catch (error) {
      console.error('Error renamign directory:', error);
    }
  }

  async loadNotesByDirectory(directoryTitle: string): Promise<void> {
    try {
      const notesInDirectory =
        await this.persistanceService.getNotesByDirectory(directoryTitle);
      this.notesList.set(notesInDirectory);
    } catch (error) {
      console.error('Error getting notes by directory:', error);
    }
  }

  async loadGroupedNotes(): Promise<void> {
    try {
      const groupedNotes =
        await this.persistanceService.getAllNotesGroupedByDirectory();
      this.groupedNotes.set(groupedNotes as any);
    } catch (error) {
      console.error('Error getting groupes notes:', error);
    }
  }

  async getAllNotesGroupedByDirectory() {
    try {
      const groupedNotes =
        await this.persistanceService.getAllNotesGroupedByDirectory();
      this.groupedNotes.set(groupedNotes as any);
    } catch (error) {
      console.error('Error fetching notes by directory:', error);
    }
  }

  async deleteDirectory(directoryTitle: string): Promise<void> {
    try {
      await this.persistanceService.deleteDirectory(directoryTitle);
      await this.loadDirectories();
      await this.loadAllNotes();
    } catch (error) {
      console.error('Error removing directory:', error);
    }
  }

  get defaultNote() {
    return this.persistanceService.getDefaultNoteContent() || '';
  }
  set defaultNote(noteContent: string) {
    this.persistanceService.setDefaultNoteContent(noteContent);
  }

  private isValidTitle(title: string): boolean {
    const regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(title);
  }

  setSelectedDirectoryTitle(title: string | null) {
    this.selectedDirectoryTitle.set(title);
  }
}
