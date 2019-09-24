import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ReporteeDashboardComponent} from './reportee-dashboard/reportee-dashboard.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'manager', component: ReporteeDashboardComponent },
  { path: '**', component: AppComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
