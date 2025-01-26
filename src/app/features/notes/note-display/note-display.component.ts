import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
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
  constructor() {
    effect(() => {
      const latestState =
        this.notesStore.getSelectedNote()?.content || this.state;
      this.state = latestState;
      this.textboxControl.setValue(this.state, { emitEvent: false });
    });
  }
  async ngOnInit(): Promise<void> {
    document.addEventListener('visibilitychange', () =>
      this.handleVisibilityChange()
    );

    // await this.syncState();

    this.inputSubscription = this.textboxControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(async (value) => {
          const selectedNote = this.notesStore.getSelectedNote();
          if (!value || !selectedNote) return;
          console.log('Saving state:', value);

          await this.notesStore.updateNote({
            ...selectedNote,
            content: value,
          });
        })
      )
      .subscribe();

    // this.startPooling();
  }

  // stopPooling() {
  //   if (this.syncInterval) {
  //     this.syncInterval.unsubscribe();
  //     this.syncInterval = null;
  //   }
  // }

  async ngOnDestroy(): Promise<void> {
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );

    // this.stopPooling();
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }

  async handleVisibilityChange(): Promise<void> {
    if (document.visibilityState === 'hidden') {
      console.log('dfssssssssssss');
      this.status = 'Inactive';
      // this.stopPooling();
    } else if (document.visibilityState === 'visible') {
      this.status = 'Active';
      await this.syncState();
      // await this.startPooling();
    }
  }

  async syncState(): Promise<void> {
    console.log('Syncing state...');
    console.log(this.notesStore.getSelectedNote());

    const persistedState =
      (await this.notesStore.getSelectedNote()?.content) ?? this.state;
    this.state = persistedState;
    console.log(this.state);
    this.textboxControl.setValue(this.state, { emitEvent: false });
  }

  //TODO: fix polling problems here
  // async startPooling(): Promise<void> {
  //   this.syncInterval = interval(5000).subscribe(async () => {
  //     console.log('Polling data...');

  //     const latestState = await this.notesStore.getSelectedNote()?.content;
  //     console.log('New data:', latestState);

  //     if (latestState !== this.textboxControl.value) {
  //       this.state = latestState || '';
  //       this.textboxControl.setValue(this.state, { emitEvent: false });
  //     }
  //   });
  // }
}
