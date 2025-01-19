import {
  Component,
  OnInit,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NotesStoreService } from '../notes-store.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from '../../../core/models/note.model';

@Component({
  selector: 'app-notes-sidebar',
  templateUrl: './notes-sidebar.component.html',
  styleUrls: ['./notes-sidebar.component.css'],
  imports: [CommonModule],
})
export class NotesSidebarComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  notesStore = inject(NotesStoreService);
  selectedNoteTitleFromDb = input();
  titleFromUrl = signal<string | null>(null);

  constructor() {
    this.route.paramMap.subscribe((paramMap) => {
      const title = paramMap.get('title');
      this.titleFromUrl.set(title);
    });
    effect(() => {
      const titleFromDb = this.selectedNoteTitleFromDb();
      if (this.titleFromUrl() !== null) {
        this.notesStore.selectNote(this.titleFromUrl() as string);
      }
      if (titleFromDb && !this.titleFromUrl) {
        this.router.navigate(['/notes', titleFromDb]);
      }
    });
  }
  ngOnInit(): void {
    const titleFromUrl = this.titleFromUrl();

    if (titleFromUrl) {
      this.notesStore.selectNote(titleFromUrl);
    }
  }

  async addNewNote(position: 'start' | 'end' | number = 'end'): Promise<void> {
    await this.notesStore.addNewNote(position);
  }

  async updateNote(note: Note): Promise<void> {
    await this.notesStore.updateNote(note);
  }

  async moveNote(noteId: string, index: number) {
    try {
      await this.notesStore.moveNote(noteId, index);
    } catch (error) {
      console.error(error);
    }
  }

  async selectNewNote(title: string): Promise<void> {
    try {
      this.router.navigate(['/notes', title]);
    } catch (error) {
      console.error('Error updating selected note:', error);
    }
  }
}
