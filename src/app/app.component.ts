import { afterNextRender, Component, ElementRef, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainNavbarComponent } from './features/main-navbar/main-navbar.component';
import { DevicePreferencesService } from './core/services/device-preferences.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainNavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'offline-browser-notes-app';
  devicePreferencesService = inject(DevicePreferencesService);

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.devicePreferencesService.screenWidth.set(window.innerWidth);
    this.devicePreferencesService.screenHeight.set(window.innerHeight);
  }

}
