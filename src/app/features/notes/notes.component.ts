import { Component, OnInit } from '@angular/core';
import { PersistanceService, Note } from './persistance.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes',
  imports: [CommonModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css',
})
export class NotesComponent {}
