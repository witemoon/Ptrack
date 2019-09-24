import { Component, OnInit, Injectable, EventEmitter, Input, Output } from '@angular/core';
import {NgbDateAdapter, NgbDateStruct, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../app.service';

const now = new Date();
const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;
export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}
export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}
export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}
@Injectable()
export class MyFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return { year: toInteger(dateParts[0]), month: null, day: null };
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
      }
    }
    return null;
  }
  format(date: NgbDateStruct): string {
    return date ?
      `${isNumber(date.day) ? padNumber(date.day) : ''}-${isNumber(date.month) ? padNumber(date.month) : ''}-${date.year}` :
      '';
  }
}
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: MyFormatter }]
})
export class DatepickerComponent implements OnInit {
  displayMonths = 1;//inputs referred from html
  navigation = 'arrows';//inputs
  showWeekNumber = false;//inputs
  currentdate; firstday; fromDate; toDate; maxDate;

  @Output() onFilter = new EventEmitter();
  constructor(private appService: AppService) { }

  ngOnInit() {
    this.currentdate = new Date();  
    this.firstday = new Date(new Date().setDate(new Date().getDate() - new Date().getDay()+1));

    this.fromDate = {year: this.firstday.getFullYear(), month: this.firstday.getMonth() + 1, day: this.firstday.getDate()};
    this.toDate = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
    this.maxDate = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
  }
  fromDateSelection($event){
    if(after(this.fromDate,this.toDate)){
      this.toDate = this.fromDate;
    }
    this.appService.fromDateSelection($event);
  }
  toDateSelection($event){
    this.appService.toDateSelection($event);
  }
}
