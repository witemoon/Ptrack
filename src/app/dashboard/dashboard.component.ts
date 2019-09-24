import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AppService } from  '../app.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  employeeName; 
  employeeCode=""; 
  reportingManagerName; 
  solutionCenter; 
  shift;
  fromDateDatePicker;
  toDateDatePicker;
  todaydate = new Date().getTime();
  todayProductiveHour;
  accessValues;
  accessproductiveValues;
  firstday;
  swipeResponse;
  reporteesCount;
  employeeCountry;
  tailGateCheck="";
  cutOffDate = new Date("2018-01-31").getTime();  
  currentDate = new Date().getTime();
  /* [ngClass]="(cutOffDate>currentDate?(data.avgProductiveMinutes<540?'avgaccess-red':'avgaccess-green'):(data.avgProductiveMinutes<480?'avgaccess-red':'avgaccess-green'))" */
  
  constructor(private  appService:  AppService, private modalService: NgbModal,private spinner: NgxSpinnerService) {    
    this.appService.listen().subscribe((event:any) => {
      if(event._elRef.nativeElement.name == "fromDatePicker"){
        this.fromDateDatePicker = event._model;
        this.onDateSelection(event);
      }else if(event._elRef.nativeElement.name == "toDatePicker"){
        this.toDateDatePicker = event._model;
        this.onDateSelection(event);
      }
    })
  }  
  ngOnInit() {
    this.getloggedUserInfo();
  }
  getloggedUserInfo(){
    this.appService.getApiCall().subscribe((data:  Array<object>) => {
      data.forEach(element => {
        this.employeeCode = element['employeeCode'];
        this.appService.employeeNumber = element['employeeCode'];
        this.employeeName = element['employeeName'];
        this.reportingManagerName = element['reportingManagerName'];
        this.solutionCenter = element['solutionCenter'];
        this.shift = element['shift'];
        this.reporteesCount = element['reporteesCount'];
        this.employeeCountry = element['country'];
      });
      this.appService.sendReporteeInfo(this.reporteesCount);
      this.getThisWeekData();
    },error=>{
      console.log(error);
    });
  }
  
  onDateSelection(event){
    if(location.hash != "#/manager"){
      if(this.fromDateDatePicker != undefined && this.toDateDatePicker != undefined && this.employeeCode != undefined){
        this.spinner.show();
        this.currentDate = new Date(new Date(this.toDateDatePicker.year,this.toDateDatePicker.month-1,this.toDateDatePicker.day)).getTime();
        this.appService.getAccessByDate(this.fromDateDatePicker, this.toDateDatePicker, this.employeeCode).subscribe((result:  Array<object>) => {
          this.spinner.hide();
          this.accessValues = result['employeeAccess'];
          this.accessproductiveValues = result['employeeProductiveAccess'];
        });
      }
    }
  }

  getThisWeekData(){
    
    this.spinner.show();
    this.firstday = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()+1));
    this.fromDateDatePicker = {year: this.firstday.getFullYear(), month: this.firstday.getMonth() + 1, day: this.firstday.getDate()};
    this.toDateDatePicker = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
    this.currentDate = new Date(new Date(this.toDateDatePicker.year,this.toDateDatePicker.month-1,this.toDateDatePicker.day)).getTime();
    this.appService.getAccessByDate(this.fromDateDatePicker, this.toDateDatePicker, this.employeeCode).subscribe((result:  Array<object>) => {
      this.spinner.hide();
      let getTodayAccess = result['employeeAccess'].length-1;
      this.accessValues = result['employeeAccess'];
      this.accessproductiveValues = result['employeeProductiveAccess'];
      this.todayProductiveHour = result['employeeAccess'][getTodayAccess]['productiveHours'];
    });
  }
  /*getTodayData(){
    this.todaydate = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
    this.appService.getAccessByDate(this.todaydate, this.todaydate, this.employeeCode).subscribe((result:  Array<object>) => {
      this.spinner.hide();
      result['employeeAccess'].forEach(element => {
        this.todayProductiveHour = element['productiveHours'];
      });
    });
  }*/
  getSwipeData(content, accessDate){
    this.appService.getSwipeDetails(accessDate, this.employeeCode).subscribe((result:  Array<object>) => {
      this.swipeResponse = result;
      this.spinner.hide();
      this.modalService.open(content, { size: 'lg' });
    });
  }
  getWeeklySwipeData(fromDate, toDate){
    if(fromDate != undefined && toDate != undefined && this.appService.employeeNumber!=undefined ){
      this.spinner.show();
      this.currentDate = new Date(new Date(toDate.year,toDate.month-1,toDate.day)).getTime();
      this.appService.getAccessByDate(fromDate, toDate, this.appService.employeeNumber).subscribe((result:  Array<object>) => {
        this.spinner.hide();
        this.accessValues = result['employeeAccess'];
        this.accessproductiveValues = result['employeeProductiveAccess'];
      });
    }
  }
  checkTailGate(entryFlag){
    let classname;
    if(this.tailGateCheck == entryFlag){
      classname = "tailgated";
    }else{
      classname = "";
    }
    this.tailGateCheck = entryFlag;
    return classname;
  }
}

