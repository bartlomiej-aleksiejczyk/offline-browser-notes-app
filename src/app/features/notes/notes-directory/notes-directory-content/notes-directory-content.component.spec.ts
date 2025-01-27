import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesDirectoryContentComponent } from './notes-directory-content.component';

describe('NotesDirectoryContentComponent', () => {
  let component: NotesDirectoryContentComponent;
  let fixture: ComponentFixture<NotesDirectoryContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesDirectoryContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesDirectoryContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
