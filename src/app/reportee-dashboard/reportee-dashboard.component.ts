import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AppService } from  '../app.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reportee-dashboard',
  templateUrl: './reportee-dashboard.component.html',
  styleUrls: ['./reportee-dashboard.component.css']
})
export class ReporteeDashboardComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  fromDateDatePicker;
  toDateDatePicker;
  todaydate;
  todayProductiveHour;
  accessValues;
  firstday;
  swipeResponse;
  reporteesData=[];
  tailGateCheck="";
  subscription;
  subscriptionArray=[];
  downloadReportList;
  downloadReportList2=[];
  accessproductiveValues;
  newArray;
  filterData: Array<any> = [];
  solutionSearchData;
  solutionFlag:boolean;

  constructor(private appService:  AppService, private modalService: NgbModal, private spinner: NgxSpinnerService) { 
    this.appService.listen().subscribe((event:any) => {
      if(event._elRef.nativeElement.name == "fromDatePicker"){
        this.fromDateDatePicker = event._model;
      }else if(event._elRef.nativeElement.name == "toDatePicker"){
        this.toDateDatePicker = event._model;
      }
    })
}

  ngOnInit() {
    this.getReporteeList();
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'reportee_EmployeeCode',
      textField: 'reportee_Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.firstday = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()+1));
    this.fromDateDatePicker = {year: this.firstday.getFullYear(), month: this.firstday.getMonth() + 1, day: this.firstday.getDate()};
    this.toDateDatePicker = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
  }
  onItemSelect (item:any) {
  }
  onSelectAll (items: any) {
  }
  OnItemDeSelect(item: any){
  }

  getReporteeList(){
    this.appService.getReporteeList().subscribe((data:  Array<object>) => {
      this.spinner.hide();
      this.dropdownList = data;
    });
  }

  searchSolutionCenter(field, searchval) {
    if (searchval.length > 0) {
      this.solutionFlag = true;
      this.appService.getReporteeList().subscribe((data:  Array<object>) => {
        this.spinner.hide();
        this.filterData = data;
        this.solutionSearchData = []
        let datas = this.filterData;
        for (let i = 0; i < datas.length; i++) {
            this.solutionSearchData.push(datas[i].reportee_WorkLocation);
          
        }
      })
    } else {
      this.solutionFlag = false;

    }
  }

  getReporteeAccess(){
    this.unsubscribeOldRequest();
    this.reporteesData = [];
    let reporteelist = [];
    let reporteeAppended ="";
    if(this.fromDateDatePicker != undefined && this.toDateDatePicker != undefined && this.selectedItems != undefined && this.selectedItems.length >0){
      this.selectedItems.forEach(element => {
        reporteelist.push(element['reportee_EmployeeCode']);
      });
      if(reporteelist.length <=3){
        let pushvalue = [];
        pushvalue = reporteelist.splice(0, reporteelist.length);
        reporteeAppended = pushvalue.join();
        this.ajaxcall(reporteeAppended);
      }else{
        for(let i=0;reporteelist.length;i=i+1){
          let pushvalue = [];
          pushvalue = reporteelist.splice(0, 3);
          reporteeAppended = pushvalue.join();
          this.ajaxcall(reporteeAppended);
        }
      }
    }
  }
  unsubscribeOldRequest(){
    if (this.subscriptionArray.length) {
      this.subscriptionArray.forEach(subscription => {
        subscription.unsubscribe();
      });
      this.subscriptionArray = [];
    }
  }
  ajaxcall(reporteeAppended){
    this.spinner.show();
    this.subscription = this.appService.getReporteeAccessByDate(this.fromDateDatePicker, this.toDateDatePicker, reporteeAppended).subscribe((result:  Array<object>) => {
      this.spinner.hide();
      this.reporteesData.push(Object.keys(result).map(function (key) { return result[key]; }));
    });
    this.subscriptionArray.push(this.subscription);
  }
  exportAsXLSX(reporteeAppended):void {
    this.newArray = [];
    for(var i=0; i<this.reporteesData.length;i++){
      this.accessproductiveValues =  this.reporteesData[i]; 
      for(var k=0;k<this.accessproductiveValues.length;k++){
       for(var j=0;j<this.accessproductiveValues[k].employeeAccess.length;j++){
           this.newArray.push({'employeeCode' : this.accessproductiveValues[k].employeeAccess[j].employeeCode,
                              'employeeName' : this.accessproductiveValues[k].employeeAccess[j].employeeName,
                              'accessDate' : this.accessproductiveValues[k].employeeAccess[j].accessDate,
                              'swipeInTime' : this.accessproductiveValues[k].employeeAccess[j].swipeInTime,
                              'swipeOutTime' : this.accessproductiveValues[k].employeeAccess[j].swipeOutTime,
                              'Time in work Area' : this.accessproductiveValues[k].employeeAccess[j].productiveHours,
                              // 'productiveMinutes' : this.accessproductiveValues[k].employeeAccess[j].productiveMinutes,
                              // 'avgProductiveMinutes' : this.accessproductiveValues[k].employeeAccess[j].avgProductiveMinutes,
                              'totalHours' : this.accessproductiveValues[k].employeeAccess[j].totalHours,
                              // 'totalMinutes' : this.accessproductiveValues[k].employeeAccess[j].totalMinutes
                            });
       }
      }
    }
    this.appService.exportAsExcelFile(this.newArray, 'sample');
  }

  getSwipeData(content, accessDate, employeeCode){
    this.appService.getReporteeSwipeDetails(accessDate, employeeCode).subscribe((result:  Array<object>) => {
      this.swipeResponse = result;
      this.modalService.open(content, { size: 'lg' }); 
    });
  }
  getWeeklySwipeData(fromDate, toDate){
    this.fromDateDatePicker = fromDate;
    this.toDateDatePicker = toDate;
    this.getReporteeAccess();
  }
  clearDropDown()
  {
    this.selectedItems = undefined;
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
