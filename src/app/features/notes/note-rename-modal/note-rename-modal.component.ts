import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  input,
  model,
  output,
} from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-rename-modal',
  imports: [FormsModule, A11yModule],
  templateUrl: './note-rename-modal.component.html',
  styleUrl: './note-rename-modal.component.css',
})
export class NoteRenameModalComponent implements OnInit, AfterViewInit {
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;

  oldName = input.required<string>();
  newName = model<string>('');
  onNameChangeAccept = output<{ oldTitle: string; newTitle: string }>();
  onNameChangeCancel = output<void>();

  ngOnInit() {
    this.newName.set(this.oldName());
  }

  ngAfterViewInit() {
    // Set focus on the input element when the component has fully initialized
    this.nameInput.nativeElement.focus();
  }

  onAccept() {
    this.onNameChangeAccept.emit({
      oldTitle: this.oldName(),
      newTitle: this.newName(),
    });
  }

  onCancel() {
    this.newName.set(this.oldName());
    this.onNameChangeCancel.emit();
  }
}
