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

    private moment: Date;

    private input1Moment: any;
    private input2Moment: any;
    private input3Moment: any;
    private input4Moment: any;
    private input5Moment: any;
    private input6Moment: any;
    private input7Moment: any;
    private input8Moment: any;
    private input9Moment: any;
    private input10Moment: any;
    private input11Moment: any;

    constructor() {
    }

    ngOnInit(): void {
    }

}
