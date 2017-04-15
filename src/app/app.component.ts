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

    public moment: Date;
    public pickerColor: string = '#0070ba';

    public input1Moment: any;
    public input2Moment: any;
    public input3Moment: any;
    public input4Moment: any;
    public input5Moment: any;
    public input6Moment: any;
    public input7Moment: any;
    public input8Moment: any;
    public input9Moment: any;
    public input10Moment: any;
    public input11Moment: any;
    public input12Moment: any;

    constructor() {
    }

    ngOnInit(): void {
    }

}
