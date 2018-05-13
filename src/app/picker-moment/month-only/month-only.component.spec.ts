import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthOnlyComponent } from './month-only.component';

describe('MonthOnlyComponent', () => {
  let component: MonthOnlyComponent;
  let fixture: ComponentFixture<MonthOnlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthOnlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
