import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActorComponent } from './edit-actor.component';

describe('EditActorComponent', () => {
  let component: EditActorComponent;
  let fixture: ComponentFixture<EditActorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditActorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditActorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
