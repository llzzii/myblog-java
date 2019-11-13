import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightAiderComponent } from './right-aider.component';

describe('RightAiderComponent', () => {
  let component: RightAiderComponent;
  let fixture: ComponentFixture<RightAiderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightAiderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightAiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
