import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicePreferencesService } from '../../core/services/device-preferences.service';
import { SiteNavigationService } from '../../core/services/site-navigation.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NotesStoreService } from '../notes/notes-store.service';

type MainNavbarIconConfig = {
  systemName: string;
  labelName: string;
  svgContent: string;
  isMobileOnly: boolean;
  onClick: VoidFunction;
}[];

@Component({
  selector: 'app-main-navbar',
  imports: [CommonModule],
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.css',
})
export class MainNavbarComponent {
  private readonly router = inject(Router);
  notesStore = inject(NotesStoreService);
  devicePreferencesService = inject(DevicePreferencesService);
  siteNavigationService = inject(SiteNavigationService);
  sanitizer = inject(DomSanitizer);

  mainNavbarIconConfig: MainNavbarIconConfig = [
    {
      systemName: 'edit-note',
      labelName: 'Edit note',
      svgContent: `<path
      d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
    />`,
      isMobileOnly: false,
      onClick: () => {
        this.router.navigate([
          '/notes',
          this.notesStore.getSelectedNoteTitle(),
        ]);
      },
    },
    {
      systemName: 'browse-files-in-directory',
      labelName: 'Browse directory content',
      svgContent: `<path
      d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"
    />`,
      isMobileOnly: true,
      onClick: () => {
        this.router.navigate(['/notes']);
      },
    },
    {
      systemName: 'browse-directory-tree',
      labelName: 'Browse directory tree',
      svgContent: `<path
      d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"
    />`,
      isMobileOnly: false,
      onClick: () => {
        this.router.navigate(['/']);
      },
    },
  ];
}
