import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent{
  reporteeCount = false;
  constructor(private appService: AppService) { 
    appService.SendReporteeMethodCall.subscribe((event:any) => {
      if(event >0){
        this.reporteeCount=true
      }else{
        this.reporteeCount=false;
      }
    });
  }
}
