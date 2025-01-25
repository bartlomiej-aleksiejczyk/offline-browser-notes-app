import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainNavbarComponent } from './features/main-navbar/main-navbar.component';
import { DevicePreferencesService } from './core/services/device-preferences.service';
import { NotesStoreService } from './features/notes/notes-store.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainNavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'offline-browser-notes-app';
  readonly devicePreferencesService = inject(DevicePreferencesService);
  readonly notesStore = inject(NotesStoreService);

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.devicePreferencesService.screenWidth.set(window.innerWidth);
    this.devicePreferencesService.screenHeight.set(window.innerHeight);
  }
}
