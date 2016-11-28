/**
 * app.component
 */

import { Component, OnInit } from "@angular/core";

import '../sass/main.scss';

@Component({
    selector: 'yk-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

    private showDatePicker: boolean = false;
    private showTimePicker: boolean = false;
    private momentValue: Date;

    constructor() {
    }

    ngOnInit(): void {
    }

    setDate(date: any): void {
        this.momentValue = date;
        return;
    }

    setTime(time: any): void {
        this.momentValue = time;
        return;
    }

    toggleDatePicker(status: boolean): void {
        this.showDatePicker = status;
        return;
    }

    toggleTimePicker(status: boolean): void {
        this.showTimePicker = status;
        return;
    }
}
