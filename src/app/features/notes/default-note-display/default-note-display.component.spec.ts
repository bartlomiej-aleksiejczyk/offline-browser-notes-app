import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultNoteDisplayComponent } from './default-note-display.component';

describe('DefaultNoteDisplayComponent', () => {
  let component: DefaultNoteDisplayComponent;
  let fixture: ComponentFixture<DefaultNoteDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultNoteDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultNoteDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
