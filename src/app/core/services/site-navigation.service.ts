import { effect, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NotesStoreService } from '../../features/notes/notes-store.service';
import { DevicePreferencesService } from './device-preferences.service';
import { routes } from '../../app.routes';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SiteNavigationService {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  notesStore = inject(NotesStoreService);
  devicePreferencesService = inject(DevicePreferencesService);
  currentRouteName = signal<string | undefined>(undefined);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        map((route) => route.snapshot)
      )
      .subscribe((routeSnapshot) => {
        const selectedNoteTitleFromUrl = routeSnapshot.paramMap.get('title');
        if (selectedNoteTitleFromUrl?.length)
          this.notesStore.selectNote(selectedNoteTitleFromUrl);
        const route = routeSnapshot?.routeConfig as any;
        this.currentRouteName.set(route.systemName);
      });
    effect(() => {
      if (!this.devicePreferencesService.isMobile()) {
        const selectedNoteTitle = this.notesStore.getSelectedNoteTitle();
        console.log(this.currentRouteName());
        if (
          selectedNoteTitle &&
          ['browse-files-in-directory', 'edit-note'].includes(
            this.currentRouteName() ?? ''
          )
        ) {
          this.router.navigate(['/notes', selectedNoteTitle]);
        }
      }
    });
  }

  navigateToRouteByTitle(title: string) {
    const route = routes.filter((route) => route.title == title)[0];
    if (!route) return;
    const fullRoute =
      route.title == 'edit_note'
        ? `notes/${this.notesStore.getSelectedNoteTitle()}`
        : route.path;
    this.router.navigate([fullRoute]);
  }
}
