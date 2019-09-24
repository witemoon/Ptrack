import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit, OnChanges {
  @Input() value: number;
  radius = 54;
  circumference = 2 * Math.PI * this.radius;
  dashoffset: number;

  constructor() {
    this.progress(0);
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value.currentValue !== changes.value.previousValue) {
      this.progress(changes.value.currentValue);
    }
  }

  private progress(value: number) {
    let data = [];
    data = value.toString().split(":");
    let hrToMins = data[0] * 60;
    let totalminutes = Number(hrToMins)+Number(data[1]);
    if(totalminutes < 540){
      const progress = totalminutes / 540;
      this.dashoffset = this.circumference * (1 - progress);
    }else{
      totalminutes = 540;
      const progress = totalminutes / 540;
      this.dashoffset = this.circumference * (1 - progress);
    }
  }
}
