import { effect, inject, Injectable, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesStoreService } from '../../features/notes/notes-store.service';
import { DevicePreferencesService } from './device-preferences.service';
import { navigationVariables, NavigationVariablesKey } from '../navigationVariables';

@Injectable({
  providedIn: 'root'
})
export class SiteNavigationService implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  notesStore = inject(NotesStoreService);
  devicePreferencesService = inject(DevicePreferencesService);
  titleFromUrl = signal<string | null>(null);
  selectedNavigationPathName = signal<NavigationVariablesKey>("note_quick_select");


  constructor() {
    this.route.paramMap.subscribe((paramMap) => {
      const title = paramMap.get('title');
      this.titleFromUrl.set(title);
    });
    effect(() => {
      const isMobile = this.devicePreferencesService.isMobile();
      if ((!isMobile && this.selectedNavigationPathName() === 'note_quick_select') || this.selectedNavigationPathName() === 'edit_note') {
        const titleFromDb = this.notesStore.selectedNoteTitle$();
        if (this.titleFromUrl() !== null) {
          this.notesStore.selectNote(this.titleFromUrl() as string);
        }
        if (titleFromDb && !this.titleFromUrl()) {
          this.router.navigate(['/notes', titleFromDb]);
        }
      } else if (this.selectedNavigationPathName() === 'note_quick_select') {
        this.router.navigate(['/notes']);
      } else if (this.selectedNavigationPathName() === 'note_quick_select') {
        this.router.navigate(['/search']);
      }
    })
  }

  ngOnInit(): void {
    const titleFromUrl = this.titleFromUrl();

    if (titleFromUrl) {
      this.notesStore.selectNote(titleFromUrl);
    }
  }
}
