import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ReporteeDashboardComponent } from '../reportee-dashboard/reportee-dashboard.component';

@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.css']
})
export class WeeklyCalendarComponent implements OnInit {
  currentYear;
  currentMonth;
  fromtodate = [];
  firstsec = true;
  secondsec = true;
  thirdsec = true;
  showCalender=true;
  selectedFromDate;
  selectedToDate;
  constructor(private Datepicker:DatepickerComponent,private Dashboard:DashboardComponent, private reporteeDashboard:ReporteeDashboardComponent) { }

  ngOnInit() {
    //get current month & year & load the weeks
    this.currentYear = (new Date).getFullYear();
    this.currentMonth = (new Date).getMonth() + 1;
    this.loadweeks(this.currentMonth, this.currentYear);
    this.monthsetdisp(this.currentMonth);
    this.disablemonthweekfunc();
  }
  ngAfterViewInit(){
    this.monthcaldisablefunc();
  }
  //load the weeks of month & year
  loadweeks(month, year) {
    this.fromtodate = [];
    $("#weekly_data_full .calendar_month_wrapper .monthDiv").removeClass("monthdivactive");
	  $("#weekly_data_full .calendar_month_wrapper .monthDiv[name="+month+"]").addClass("monthdivactive");
    var yearfordaycal = year;
    var lastmonth = Number(month - 1);
    if (month == '1') {
      year = Number(year - 1);
      lastmonth = 12;
    }
    var lastmondaysarray = this.getmondays(year, lastmonth);
    var lastmonday = lastmondaysarray[lastmondaysarray.length - 1];
    var dateselected = new Date(yearfordaycal, month);
    var lastday = new Date(dateselected.getFullYear(), dateselected.getMonth(), 0);
    var lastday_date = lastday.getDate();
    var lastday_date_formatted = (Number(lastday_date) < 10) ? "0" + lastday_date : lastday_date;
    var lastday_month = lastday.getMonth() + 1;
    var lastday_month_formatted = (Number(lastday_month) < 10) ? "0" + lastday_month : lastday_month;
    var lastday_year = lastday.getFullYear();
    var lastdayofmonth = lastday_year + "-" + lastday_month_formatted + "-" + lastday_date_formatted;
    var numofdays = this.daysbetdates(lastmonday, lastdayofmonth);
    var numweeks = Math.abs(numofdays / 7);

    for (var i = 0; i <= numweeks; i++) {
      var getsat = this.getsunday(lastmonday);

      var prevdaydate = lastmonday.split("-");
      var nextdaydate = getsat.split("-");
      var weeknumber = (Number((i + 1)) < 10) ? "0" + (i + 1) : (i + 1);
      var prevnextdatearray = new Array();
      prevnextdatearray[0] = lastmonday;
      prevnextdatearray[1] = getsat;

      //check todays date & compair with last date of week, if less then active else disable it.
      var today11 = new Date();
      var dd = today11.getDate();
      var dd_formatted = (Number(dd) < 10) ? "0" + dd : dd;
      var mm = today11.getMonth() + 1; //January is 0!
      var mm_formatted = (Number(mm) < 10) ? "0" + mm : mm;
      var yyyy = today11.getFullYear();
      var todaydate11 = yyyy + '-' + mm_formatted + '-' + dd_formatted;

      var date11 = this.parseISO8601(todaydate11);
      var todaydatetimestamp = date11.getTime();	//timestamp of todays date
      var date22 = this.parseISO8601(lastmonday);	//timestamp of last monday date
      var uptodaydatetimestamp = date22.getTime();

      var date23 = this.parseISO8601('2013-05-05');	//timestamp of 2013-3-20
      var timestamp20 = date23.getTime();

      var date24 = this.parseISO8601(getsat);	//timestamp of sunday
      var timestampsunday = date24.getTime();
      var jsonObject: any={};
      if (timestampsunday <= timestamp20) {
        jsonObject = { "disabledbox": "", "weeknumber": weeknumber, "prevdaydate": prevdaydate[2], "nextdaydate": nextdaydate[2], "prevnextdatearray": prevnextdatearray };
      }
      else if (uptodaydatetimestamp <= todaydatetimestamp) {
        jsonObject = { "disabledbox": "", "weeknumber": weeknumber, "prevdaydate": prevdaydate[2], "nextdaydate": nextdaydate[2], "prevnextdatearray": prevnextdatearray };
      }
      else {
        jsonObject = { "disabledbox": "weekdeactive", "weeknumber": weeknumber, "prevdaydate": prevdaydate[2], "nextdaydate": nextdaydate[2], "prevnextdatearray": prevnextdatearray };
      }

      this.fromtodate.push(jsonObject);

      var splitgetsat = getsat.split("-");

      var nextsundaysun = new Date(Number(splitgetsat[0]), Number(splitgetsat[1]) - 1, Number(splitgetsat[2]));
      nextsundaysun.setDate(nextsundaysun.getDate() + 1);

      var nextsundayMonth = nextsundaysun.getMonth() + 1;
      var nextsundayMonth_formatted = (Number(nextsundayMonth) < 10) ? "0" + nextsundayMonth : nextsundayMonth;
      var nextsundayDay = nextsundaysun.getDate();
      var nextsundayDay_formatted = (Number(nextsundayDay) < 10) ? "0" + nextsundayDay : nextsundayDay;
      var nextsundayYear = nextsundaysun.getFullYear();
      lastmonday = nextsundayYear + "-" + nextsundayMonth_formatted + "-" + nextsundayDay_formatted;

    }
  }
  //get the list of mondays of year & month passed
  getmondays(year, month) {
    var mondays = new Array();
    var i = 0;
    month = (month < 10) ? "0" + month : month;
    var tdays = new Date(year, month, 0).getDate();
    for (var date = 1; date <= tdays; date++) {
      var sdate = (date < 10) ? "0" + date : date;
      var dd = year + "-" + month + "-" + sdate;
      var day = new Date(year, month - 1, date);
      if (day.getDay() == 1) {
        mondays[i++] = dd;
      }
    }
    return mondays;
  }

  // Get the date after 6 days from monday to sat
  getsunday(lastmonday) {
    var splitlastmonday = lastmonday.split("-");

    var nextsunday = new Date(splitlastmonday[0], splitlastmonday[1] - 1, splitlastmonday[2]);
    nextsunday.setDate(nextsunday.getDate() + 6);

    var nextsundayMonth = nextsunday.getMonth() + 1;
    var nextsundayMonth_formatted = (Number(nextsundayMonth) < 10) ? "0" + nextsundayMonth : nextsundayMonth;
    var nextsundayDay = nextsunday.getDate();
    var nextsundayDay_formatted = (Number(nextsundayDay) < 10) ? "0" + nextsundayDay : nextsundayDay;
    var nextsundayYear = nextsunday.getFullYear();
    var nextsundaydate = nextsundayYear + "-" + nextsundayMonth_formatted + "-" + nextsundayDay_formatted;
    return nextsundaydate;
  }
  //number of days between 2 dates
  daysbetdates(date1, date2) {
    // Here are the two dates to compare
    date1 = this.parseISO8601(date1);
    date2 = this.parseISO8601(date2);

    var ONE_DAY = 1000 * 60 * 60 * 24;
    var d1 = date1.getTime();
    var d2 = date2.getTime();
    var diff = Math.abs(d1 - d2);
    var diffDays = Math.round(diff / ONE_DAY);

    return diffDays;
  }

  //An Extended ISO 8601 local date format YYYY-MM-DD can be parsed to a Date with the following
  parseISO8601(dateStringInRange) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
      date = new Date(NaN), month,
      parts = isoExp.exec(dateStringInRange);
    if (parts) {
      month = +parts[2];
      date.setFullYear(Number(parts[1]), month - 1, Number(parts[3]));
      if (month != date.getMonth() + 1) {
        date.setTime(NaN);
      }
    }
    return date;
  }
  //display the current month set of div & hide others
  monthsetdisp(currentMonth) {
    if (currentMonth <= 5) {
      this.firstsec = true;
      this.secondsec = false;
      this.thirdsec = false;
    }
    else if (currentMonth > 5 && currentMonth <= 10) {
      this.firstsec = false;
      this.secondsec = true;
      this.thirdsec = false;
    }
    else if (currentMonth > 10 && currentMonth <= 12) {
      this.firstsec = false;
      this.secondsec = false;
      this.thirdsec = true;
    }
  }

  //disable all next months axcept current month & previous month in weekly calendar
  disablemonthweekfunc() {
    var currentYear = (new Date).getFullYear();
    var currentMonth = (new Date).getMonth() + 1;

    $("#weekly_data_full .calendar_month_wrapper .monthcontainer .monthDiv").each(function () {
      var nameattr = $(this).attr("name");
      var calendar_year_text = parseInt($("#weekly_data_full .calendar_year_text").html());

      if ((nameattr > currentMonth) && (calendar_year_text >= currentYear)) {
        $(this).addClass("monthdivdeactive");
      }
      else if ((nameattr == '1' || nameattr == '2' || nameattr == '3' || nameattr == '4' || nameattr == '5' || nameattr == '6' || nameattr == '7' || nameattr == '8') && (calendar_year_text == 2015)) {
        $(this).addClass("monthdivdeactive");
      }
      else {
        $(this).removeClass("monthdivdeactive");
      }
    });
  }
  monthcaldisablefunc(){
    var currentYear = (new Date).getFullYear();
    var currentMonth = (new Date).getMonth()+1;
    $(".calendar_month_wrapper .monthDiv").each(function(){
      var nameattr = $(this).attr("name");
      var calendar_year_text = parseInt($(".calendar_year_text").html());

      if((nameattr > currentMonth) && (calendar_year_text >= currentYear)){
        $(this).addClass("monthdivdeactive");
      }
      else if( (nameattr == '0' || nameattr == '1') && (calendar_year_text == 2013) ){
        $(this).addClass("monthdivdeactive");
      }
      else
      {
        $(this).removeClass("monthdivdeactive");
      }
    });
  }
  arrowFunction(action){
    var calendar_year_text = Number($("#weekly_data_full .calendar_year_text").html());
    var currentYear = (new Date).getFullYear();
    var selectedYear;
    if(action == "next"){
      selectedYear = Number(calendar_year_text + 1);
      if(selectedYear > currentYear){
        return false;
      }
      else
      {
        $("#weekly_data_full .calendar_year_text").html('' + selectedYear);
        var activemonth = $("#weekly_data_full .calendar_month_wrapper .monthdivactive").attr("name");

      }
    }else if(action == "prev"){
      selectedYear = Number(calendar_year_text - 1);
      if(selectedYear == 2014){
        return false;
      }
      else
      {
        $("#weekly_data_full .calendar_year_text").html('' + selectedYear);
        var activemonth = $("#weekly_data_full .calendar_month_wrapper .monthdivactive").attr("name");
      }
    }
    this.loadweeks(activemonth,selectedYear);
    this.disablemonthweekfunc();
  }
  monthArrowFn(action){
    //when right arrow clicked scroll to next months in weekly calendar
    var monthslotssplit1 = $("#weekly_data_full .calendar_month_wrapper .monthsetactive").attr("id");
    if(action == "next"){
      if(monthslotssplit1 == "monthset-1"){
        this.firstsec=false;
        this.secondsec=true;
        this.thirdsec=false;
      }else if(monthslotssplit1 == "monthset-2"){
        this.firstsec=false;
        this.secondsec=false;
        this.thirdsec=true;
      }else if(monthslotssplit1 == "monthset-3"){
        return false;
      }
    }else if(action == "prev"){
      if(monthslotssplit1 == "monthset-1"){
        return false;
      }else if(monthslotssplit1 == "monthset-2"){
        this.firstsec=true;
        this.secondsec=false;
        this.thirdsec=false;
      }else if(monthslotssplit1 == "monthset-3"){
        this.firstsec=false;
        this.secondsec=true;
        this.thirdsec=false;
      }
    }
  }
  onMonthSelect($event){
    var year = Number($("#weekly_data_full .calendar_year_text").html());
    var month = $event.currentTarget.getAttribute('name');
    var currentdate = new Date();
    if(!$(event.currentTarget).hasClass("monthdivdeactive")){
      $("#weekly_data_full .calendar_month_wrapper .monthDiv").removeClass("monthdivactive");
      $(event.currentTarget).addClass("monthdivactive");
      this.loadweeks(month,year);
      var dateselected = new Date(year, month-1);
      var firstday = new Date(dateselected.getFullYear(), dateselected.getMonth(), 1);
      var lastday = new Date(dateselected.getFullYear(), dateselected.getMonth()+1, 0);
      if(lastday.getTime() > currentdate.getTime()){
        lastday = currentdate;
      }
      this.Datepicker.fromDate = {year: firstday.getFullYear(), month: firstday.getMonth()+1, day: firstday.getDate()};
      this.Datepicker.toDate = {year: lastday.getFullYear(), month: lastday.getMonth()+1, day: lastday.getDate()};
		}
		else
		{
			return false;
		}
  }
  onWeekSelectFn($event, prevnextdatearray){
    var selectedFromDate = new Date(prevnextdatearray[0]);
    var selectedToDate = new Date(prevnextdatearray[1]);
    var currentdate = new Date();
    if(selectedToDate.getTime() > currentdate.getTime()){
      selectedToDate = currentdate
    }
    this.Datepicker.fromDate = {year: selectedFromDate.getFullYear(), month: selectedFromDate.getMonth()+1, day: selectedFromDate.getDate()};
    this.Datepicker.toDate = {year: selectedToDate.getFullYear(), month: selectedToDate.getMonth()+1, day: selectedToDate.getDate()};
    if(!$(event.currentTarget).hasClass("weekdeactive")){
      $("#weekly_data_full .calendar_week .weekBox").removeClass("weekactive");
      $(event.currentTarget).addClass("weekactive");
    }else{
      return false;
    }
  }
  cancelPopup(){
    this.showCalender = true;
  }
  submitAction(){
    var year = Number($("#weekly_data_full .calendar_year_text").html());
    var currentdate = new Date();
    if(!(this.Datepicker.fromDate && this.Datepicker.toDate)){
      var month = document.getElementsByClassName('monthdivactive')[0].getAttribute("name");
      var dateselected = new Date(year, Number(month)-1);
			var firstday = new Date(dateselected.getFullYear(), dateselected.getMonth(), 1);
      var lastday = new Date(dateselected.getFullYear(), dateselected.getMonth()+1, 0);
      if(lastday.getTime() > currentdate.getTime()){
        lastday = currentdate;
      }
      this.Datepicker.fromDate = {year: firstday.getFullYear(), month: firstday.getMonth()+1, day: firstday.getDate()};
      this.Datepicker.toDate = {year: lastday.getFullYear(), month: lastday.getMonth()+1, day: lastday.getDate()};
    }else if(this.Datepicker.fromDate.year != year){
      this.Datepicker.fromDate.year = year;
      this.Datepicker.toDate.year = year;
    }
    if(location.hash == "#/manager"){
      this.reporteeDashboard.getWeeklySwipeData(this.Datepicker.fromDate, this.Datepicker.toDate);
    }else{
      this.Dashboard.getWeeklySwipeData(this.Datepicker.fromDate, this.Datepicker.toDate);
    }
    this.showCalender = true;
  }
}
