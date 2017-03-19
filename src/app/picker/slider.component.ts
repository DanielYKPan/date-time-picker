/**
 * slider.component
 */

import { Component, OnInit, ElementRef, Input, ViewChild, Renderer, Output, EventEmitter } from '@angular/core';

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

    @Input() step: number = 1;
    @Input() floor: number = 0;
    @Input() ceiling: number = 100;
    @Input() precision: number = 0;
    @Input() low: number;
    @Output() lowChange = new EventEmitter<number>(true);

    @ViewChild('bar') bar: ElementRef;
    @ViewChild('highlight') highlight: ElementRef;
    @ViewChild('lowPointer') lowPointer: ElementRef;

    private pointerHalfWidth = 0;
    private barWidth = 0;
    private minOffset = 0;
    private maxOffset = 0;
    private minValue = 0;
    private maxValue = 0;
    private valueRange = 0;
    private offsetRange = 0;

    constructor( private el: ElementRef,
                 private renderer: Renderer, ) {
        this.listenerMove = ( event: any ) => {
            this.move(event)
        };
        this.listenerStop = () => {
            this.stop()
        };
    }

    public ngOnInit() {
        this.pointerHalfWidth = this.lowPointer.nativeElement.offsetWidth / 2;
        this.barWidth = this.bar.nativeElement.offsetWidth;
        this.maxOffset = this.barWidth - this.lowPointer.nativeElement.offsetWidth;
        this.minValue = this.floor;
        this.maxValue = this.ceiling;
        this.valueRange = this.maxValue - this.minValue;
        this.offsetRange = this.maxOffset - this.minOffset;

        this.setPointers();
    }

    private setPointers(): void {

        let lowPercentValue, lowOffsetValue;
        lowPercentValue = this.percentValue(this.low);
        lowOffsetValue = this.pixelsToOffset(lowPercentValue);

        this.renderer.setElementStyle(
            this.lowPointer.nativeElement,
            'left',
            lowOffsetValue + 'px'
        );

        this.renderer.setElementStyle(
            this.highlight.nativeElement,
            'width',
            lowOffsetValue + 'px'
        );
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

        let lowOldValue = this.low;
        let newOffset = Math.max(Math.min(this.getX(event), this.maxOffset), this.minOffset);
        let newPercent = this.percentOffset(newOffset);
        let newValue = this.minValue + (this.valueRange * newPercent / 100);
        newValue = this.roundStep(newValue, this.precision, this.step, this.floor);

        this.low = newValue;
        this.setPointers();
        if (this.low !== lowOldValue) {
            this.lowChange.emit(this.low);
        }
    }

    private getX( event: any ): number {
        return (event.pageX !== undefined ? event.pageX : event.touches[0].pageX) - this.el.nativeElement.getBoundingClientRect().left - this.pointerHalfWidth;
    }

    private roundStep( value: number, precision: number, step: number, floor: number ) {
        let remainder = (value - floor) % step;
        let steppedValue = remainder > (step / 2) ? value + step - remainder : value - remainder;
        let decimals = Math.pow(10, precision);
        let roundedValue = steppedValue * decimals / decimals;
        return parseFloat(roundedValue.toFixed(precision));
    }

    private contain( value: number ): number {
        if (isNaN(value)) return value;
        return Math.min(Math.max(0, value), 100);
    }

    private percentValue( value: number ): number {
        return this.contain(((value - this.minValue) / this.valueRange) * 100);
    };

    private percentOffset( offset: number ): number {
        return this.contain(((offset - this.minOffset) / this.offsetRange) * 100);
    };

    private pixelsToOffset( percent: number ): number {
        return percent * this.offsetRange / 100;
    };
}
