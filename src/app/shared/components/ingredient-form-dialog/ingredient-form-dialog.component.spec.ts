import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientFormDialogComponent } from './ingredient-form-dialog.component';

describe('IngredientFormDialogComponent', () => {
  let component: IngredientFormDialogComponent;
  let fixture: ComponentFixture<IngredientFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
