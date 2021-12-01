import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostESignComponent } from './post-e-sign.component';

describe('PostESignComponent', () => {
  let component: PostESignComponent;
  let fixture: ComponentFixture<PostESignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostESignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostESignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
