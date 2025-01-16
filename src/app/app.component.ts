import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotesComponent } from './features/notes/notes.component';
import { InfoFooterComponent } from './features/info-footer/info-footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotesComponent, InfoFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'offline-browser-notes-app';
}
