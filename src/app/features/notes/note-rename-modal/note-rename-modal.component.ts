import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-rename-modal',
  imports: [FormsModule],
  templateUrl: './note-rename-modal.component.html',
  styleUrl: './note-rename-modal.component.css',
})
export class NoteRenameModalComponent {
  oldName = input.required<string>();
  newName = model<string>('');
  onNameChangeAccept = output<{ oldTitle: string; newTitle: string }>();
  onNameChangeCancel = output<void>();

  ngOnInit() {
    this.newName.set(this.oldName());
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
