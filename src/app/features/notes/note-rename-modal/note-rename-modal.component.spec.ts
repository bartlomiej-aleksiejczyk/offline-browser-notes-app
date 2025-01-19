import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteRenameModalComponent } from './note-rename-modal.component';

describe('NoteRenameModalComponent', () => {
  let component: NoteRenameModalComponent;
  let fixture: ComponentFixture<NoteRenameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteRenameModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteRenameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
