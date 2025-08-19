import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusSpinnerComponent } from './status-spinner.component';

describe('StatusSpinnerComponent', () => {
  let component: StatusSpinnerComponent;
  let fixture: ComponentFixture<StatusSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusSpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
