import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteeDashboardComponent } from './reportee-dashboard.component';

describe('ReporteeDashboardComponent', () => {
  let component: ReporteeDashboardComponent;
  let fixture: ComponentFixture<ReporteeDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteeDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
