import { ComponentFixture, TestBed } from '@angular/core/testing';

import DashboardComponent from './dashboard.component';
import { StorageService } from '@app/data-layer/storage.service';
import { FakeStorageService } from '@app/data-layer/fake-storage.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: StorageService,
          useClass: FakeStorageService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
