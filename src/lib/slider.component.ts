/**
 * slider.component
 */

import {
    Component, OnInit, ElementRef, Input, ViewChild, Output, EventEmitter,
    Renderer2, OnDestroy
} from '@angular/core';
import { PickerService } from './picker.service';

@Component({
    selector: 'app-slide-bar',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    host: {
        '(mousedown)': 'start($event)',
        '(touchstart)': 'start($event)'
    }
})
export class SlideControlComponent implements OnInit, OnDestroy {

    private movePointer: any;
    private stopPointer: any;
    private mouseMoveListener: any;
    private mouseUpListener: any;
    private touchMoveListener: any;
    private touchEndListener: any;
    private themeColor: string;

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
                 private renderer: Renderer2,
                 private service: PickerService ) {
        this.movePointer = ( event: any ) => {
            this.move(event)
        };
        this.stopPointer = () => {
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
        this.themeColor = this.service.dtTheme;
        this.renderer.setStyle(this.highlight.nativeElement, 'backgroundColor', this.themeColor);
        this.setPointers();
    }

    public ngOnDestroy(): void {
        if (this.mouseMoveListener) {
            this.mouseMoveListener();
        }

        if (this.mouseUpListener) {
            this.mouseUpListener();
        }

        if (this.touchMoveListener) {
            this.touchMoveListener();
        }

        if (this.touchEndListener) {
            this.touchEndListener();
        }
    }

    public start( event: any ) {
        this.mouseMoveListener = this.renderer.listen('document', 'mousemove', this.movePointer);
        this.touchMoveListener = this.renderer.listen('document', 'touchmove', this.movePointer);
        this.mouseUpListener = this.renderer.listen('document', 'mouseup', this.stopPointer);
        this.touchEndListener = this.renderer.listen('document', 'touchend', this.stopPointer);
    }

    private setPointers(): void {

        let lowPercentValue, lowOffsetValue;
        lowPercentValue = this.percentValue(this.low);
        lowOffsetValue = this.pixelsToOffset(lowPercentValue);

        this.renderer.setStyle(
            this.lowPointer.nativeElement,
            'left',
            lowOffsetValue + 'px'
        );

        this.renderer.setStyle(
            this.highlight.nativeElement,
            'width',
            lowOffsetValue + 'px'
        );
    }

    private stop() {
        this.mouseMoveListener();
        this.touchMoveListener();
        this.mouseUpListener();
        this.touchEndListener();
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
