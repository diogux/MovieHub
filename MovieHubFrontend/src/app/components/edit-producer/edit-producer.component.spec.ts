import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProducerComponent } from './edit-producer.component';

describe('EditProducerComponent', () => {
  let component: EditProducerComponent;
  let fixture: ComponentFixture<EditProducerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProducerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProducerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
