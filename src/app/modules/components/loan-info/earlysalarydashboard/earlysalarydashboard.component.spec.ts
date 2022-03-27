import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlysalarydashboardComponent } from './earlysalarydashboard.component';

describe('EarlysalarydashboardComponent', () => {
  let component: EarlysalarydashboardComponent;
  let fixture: ComponentFixture<EarlysalarydashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarlysalarydashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlysalarydashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
