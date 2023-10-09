import { ComponentFixture, TestBed } from '@angular/core/testing';

import DashboardComponent from './dashboard.component';
import { StorageService } from '@app/data-layer/storage.service';
import { FakeStorageService } from '@app/data-layer/fake-storage.service';
import { ActivatedRoute } from '@angular/router';

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
        {
          provide: ActivatedRoute,
          useValue: {},
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
