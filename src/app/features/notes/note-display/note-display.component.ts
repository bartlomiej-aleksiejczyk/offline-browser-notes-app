import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotesStoreService } from '../notes-store.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, interval, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule, TextFieldModule, CommonModule, ReactiveFormsModule],
  selector: 'app-note-display',
  templateUrl: './note-display.component.html',
  styleUrls: ['./note-display.component.css'],
})
// TODO: fix signal misuse that works, understand why
export class NoteDisplayComponent implements OnInit, OnDestroy {
  notesStore = inject(NotesStoreService);
  state: string = '';
  status: string = 'Active';
  private syncInterval: Subscription | null = null;
  private inputSubscription: Subscription | null = null;
  textboxControl = new FormControl('');

  ngOnInit(): void {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    this.syncState();

    this.inputSubscription = this.textboxControl.valueChanges
      .pipe(
        debounceTime(500),
        tap((value) => {
          const selectedNote = this.notesStore.getSelectedNote();
          if (!value || !selectedNote) return;
          console.log('Saving state:', value);

          this.notesStore.updateNote({
            ...selectedNote,
            content: value,
          });
        })
      )
      .subscribe();

    this.startPooling();
  }

  ngOnDestroy(): void {
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );
    this.stopPooling();
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }

  handleVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') {
      this.status = 'Inactive';
      this.stopPooling();
    } else if (document.visibilityState === 'visible') {
      this.status = 'Active';
      this.syncState();
      this.startPooling();
    }
  };

  syncState(): void {
    console.log('Syncing state...');
    this.state = this.notesStore.getSelectedNote()?.content ?? this.state;
    this.textboxControl.setValue(this.state, { emitEvent: false });
  }

  startPooling(): void {
    this.syncInterval = interval(5000).subscribe(() => {
      console.log('Polling data...');
      const latestState =
        this.notesStore.getSelectedNote()?.content || this.state;
      if (latestState !== this.textboxControl.value) {
        this.state = latestState;
        this.textboxControl.setValue(this.state, { emitEvent: false });
      }
    });
  }

  stopPooling(): void {
    if (this.syncInterval) {
      this.syncInterval.unsubscribe();
      this.syncInterval = null;
    }
  }

  //=================================================================//
  noteContentInput = computed(() => {
    return this.notesStore.getSelectedNote()?.content ?? '';
  });

  get noteContent(): string {
    return this.notesStore.getSelectedNote()?.content || '';
  }

  set noteContent(value: string) {
    const selectedNote = this.notesStore.getSelectedNote();
    if (selectedNote) {
      this.notesStore.updateNote({ ...selectedNote, content: value });
    }
  }
}
