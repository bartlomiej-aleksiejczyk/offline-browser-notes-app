import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesDirectorySidebarComponent } from './notes-directory-sidebar.component';

describe('NotesDirectorySidebarComponent', () => {
  let component: NotesDirectorySidebarComponent;
  let fixture: ComponentFixture<NotesDirectorySidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesDirectorySidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesDirectorySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
