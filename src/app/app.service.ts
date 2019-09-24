import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment.prod';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _listners = new Subject<any>();
  employeeNumber;
  newArray1 = [];
  newArray;
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    let sheet = json;

    console.log('sheetsheet',sheet);
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // for(var i=0;i<worksheet.length;i++){
    //   this.newArray1.push(worksheet[i]);
    // }
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'newArray': worksheet }, SheetNames: ['newArray'] };
    console.log('workbook',workbook);
   
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }




  listen(): Observable<any> {
      return this._listners.asObservable();
  }
  constructor(private  httpClient:  HttpClient, private spinner: NgxSpinnerService) { }
  fromDateSelection($event){
    this._listners.next($event);
  }
  toDateSelection($event){
    this._listners.next($event);
  }
  getApiCall(){
    return  this.httpClient.get(`${environment.API_URL}`);
  }
  getAccessByDate(fromDate, toDate, employeenumber){
    if(fromDate != undefined && toDate != undefined && employeenumber!=undefined ){
      fromDate = fromDate.year+"-"+fromDate.month+"-"+fromDate.day;
      toDate = toDate.year+"-"+toDate.month+"-"+toDate.day;
      let resqustBody = {"fromDate":fromDate, "toDate":toDate, "employeenumber":employeenumber};
      return this.httpClient.post(`${environment.ACCESS_URL}`, resqustBody);
    }
  }
  getReporteeList(){
    this.spinner.show();
    return  this.httpClient.get(`${environment.REPORTEELIST_URL}`);
  }
  
  getReporteeAccessByDate(fromDate, toDate, employeenumber){
    if(fromDate != undefined && toDate != undefined && employeenumber!=undefined ){
      this.spinner.show();
      fromDate = fromDate.year+"-"+fromDate.month+"-"+fromDate.day;
      toDate = toDate.year+"-"+toDate.month+"-"+toDate.day;
      let resqustBody = {"fromDate":fromDate, "toDate":toDate, "employeenumber":employeenumber};
      return this.httpClient.post(`${environment.REPORTEE_ACCESS_URL}`, resqustBody);
    }
  }
  getSwipeDetails(swipeDate, employeenumber){
    if(swipeDate != "" && swipeDate != undefined && employeenumber != "" && employeenumber != undefined){
      let resqustBody = {"logDate":swipeDate,"employeenumber":employeenumber};
      return this.httpClient.post(environment.SWIPE_URL, resqustBody);
    }
  }
  getReporteeSwipeDetails(swipeDate, employeenumber){
    if(swipeDate != "" && swipeDate != undefined && employeenumber != "" && employeenumber != undefined){
      let resqustBody = {"logDate":swipeDate,"employeenumber":employeenumber};
      return this.httpClient.post(environment.REPORTEE_SWIPE_URL, resqustBody);
    }
  }
  // Observable string sources
  private SendReporteeMethodSource = new Subject<any>();
  // Observable string streams
  SendReporteeMethodCall = this.SendReporteeMethodSource.asObservable();

  sendReporteeInfo(result){
    this.SendReporteeMethodSource.next(result);
  }
}