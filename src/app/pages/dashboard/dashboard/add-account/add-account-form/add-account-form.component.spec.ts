import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountFormComponent } from './add-account-form.component';

describe('AddAccountFormComponent', () => {
  let component: AddAccountFormComponent;
  let fixture: ComponentFixture<AddAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAccountFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
