import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { HttpClientModule } from '@angular/common/http';
import { AppService } from './app.service';
import { AppRoutingModule } from './/app-routing.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ReporteeDashboardComponent } from './reportee-dashboard/reportee-dashboard.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProgressComponent } from './progress/progress.component';
import { WeeklyCalendarComponent } from './weekly-calendar/weekly-calendar.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    DatepickerComponent,
    ReporteeDashboardComponent,
    ProgressComponent,
    WeeklyCalendarComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      "radius": 60,
      "space": -10,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#4882c2",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 10,
      "showTitle":true,
      "subtitle":"Total hours",
      "animateTitle": false,
      "subtitleFontSize": "15",
      "titleFontSize": "35  ",
      "animationDuration": 10,
      "showUnits": false,
      "showBackground": false,
      "clockwise": true,
      "maxPercent": 9,
      "showSubtitle": true,
    })
  ],
  providers: [AppService, DatepickerComponent, DashboardComponent, ReporteeDashboardComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
