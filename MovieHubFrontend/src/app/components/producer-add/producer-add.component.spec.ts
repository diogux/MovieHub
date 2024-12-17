import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerAddComponent } from './producer-add.component';

describe('ProducerAddComponent', () => {
  let component: ProducerAddComponent;
  let fixture: ComponentFixture<ProducerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducerAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProducerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
