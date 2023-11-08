import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActionsComponent } from './account-actions.component';

describe('AccountActionsComponent', () => {
  let component: AccountActionsComponent;
  let fixture: ComponentFixture<AccountActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountActionsComponent],
    });
    fixture = TestBed.createComponent(AccountActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
