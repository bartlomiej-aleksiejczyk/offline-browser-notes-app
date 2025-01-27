import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesDirectoryComponent } from './notes-directory.component';

describe('NotesDirectoryComponent', () => {
  let component: NotesDirectoryComponent;
  let fixture: ComponentFixture<NotesDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesDirectoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
