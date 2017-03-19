/**
 * slider.component
 */

import { Component, OnInit, ElementRef } from '@angular/core';

// webpack1_
declare let require: any;
const myDpStyles: string = require("./slider.component.scss");
const myDpTpl: string = require("./slider.component.html");
// webpack2_

@Component({
    selector: 'app-slide-bar',
    template: myDpTpl,
    styles: [myDpStyles],
    host: {
        '(mousedown)': 'start($event)',
        '(touchstart)': 'start($event)'
    }
})
export class SlideControlComponent implements OnInit {

    private listenerMove: any;
    private listenerStop: any;

    left : number = 0;

    constructor( private el: ElementRef ) {
        this.listenerMove = ( event: any ) => {
            this.move(event)
        };
        this.listenerStop = () => {
            this.stop()
        };
    }

    public ngOnInit() {
    }

    private setCursor( event: any ): void {
        let width = this.el.nativeElement.offsetWidth;
        let x = Math.max(0, Math.min(this.getX(event), width));

        this.left =  x;
    }

    private start( event: any ) {
        document.addEventListener('mousemove', this.listenerMove);
        document.addEventListener('touchmove', this.listenerMove);
        document.addEventListener('mouseup', this.listenerStop);
        document.addEventListener('touchend', this.listenerStop);
    }

    private stop() {
        document.removeEventListener('mousemove', this.listenerMove);
        document.removeEventListener('touchmove', this.listenerMove);
        document.removeEventListener('mouseup', this.listenerStop);
        document.removeEventListener('touchend', this.listenerStop);
    }

    private move( event: any ) {
        event.preventDefault();
        this.setCursor(event);
    }

    private getX( event: any ): number {
        return (event.pageX !== undefined ? event.pageX : event.touches[0].pageX) - this.el.nativeElement.getBoundingClientRect().left - window.pageXOffset;
    }
}
