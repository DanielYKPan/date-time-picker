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
    private date: string;
    private time: string;

    constructor() {
    }

    ngOnInit(): void {
    }

    setDate(date: string): void {
        this.date = date;
        return;
    }

    setTime(time: string): void {
        this.time = time;
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
