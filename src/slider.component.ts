/**
 * slider.component
 */

import {
    Component, OnInit, ElementRef, Input, ViewChild,
    Renderer2, OnDestroy, forwardRef, AfterViewInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const SLIDER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SlideControlComponent),
    multi: true
};

@Component({
    selector: 'app-slide-bar',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    providers: [SLIDER_VALUE_ACCESSOR],
})
export class SlideControlComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

    @Input() min: number = 0;
    @Input() max: number = 100;
    @Input() style: any;
    @ViewChild('slider') sliderElm: ElementRef;

    public handleValue: number;
    public isDragging: boolean = false;
    public initY: number;
    public sliderHeight: number;
    public startHandleValue: number;
    public startY: number;
    public value: number = 0;

    public onModelChange: Function = () => {
    };
    public onModelTouched: Function = () => {
    };
    private dragListener: any;
    private mouseUpListener: any;

    constructor( private renderer: Renderer2 ) {
    }

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this.dragListener();
        this.mouseUpListener();
    }

    public ngAfterViewInit(): void {
        this.dragListener = this.renderer.listen('document', 'mousemove', ( event ) => {
            if (this.isDragging) {
                this.handleChange(event);
            }
        });

        this.mouseUpListener = this.renderer.listen('document', 'mouseup', ( event ) => {
            if (this.isDragging) {
                this.isDragging = false;
            }
        });
    }

    public onMouseDown( event: any ) {
        this.isDragging = true;
        this.updateSliderData();
        event.preventDefault();
    }

    public onTouchStart( event: any ): void {
        let touchObj = event.changedTouches[0];
        this.startHandleValue = this.handleValue;
        this.isDragging = true;
        this.startY = parseInt(touchObj.clientY, 10);
        this.sliderHeight = this.sliderElm.nativeElement.offsetHeight;
        event.preventDefault();
    }

    public onTouchMove( event: any ): void {
        let touchObj = event.changedTouches[0];
        let handleValue;
        handleValue = Math.floor(((this.startY - parseInt(touchObj.clientY, 10)) * 100) / (this.sliderHeight)) + this.startHandleValue;
        this.setValueFromHandle(event, handleValue);
        event.preventDefault();
    }

    public updateSliderData(): void {
        let rect = this.sliderElm.nativeElement.getBoundingClientRect();
        this.initY = rect.top + this.getWindowScrollTop();
        this.sliderHeight = this.sliderElm.nativeElement.offsetHeight;
        return;
    }

    public updateData(value: any): void {
        this.updateValue(value);
        this.updateHandleValue();
    }

    public writeValue( value: any ): void {
        if (value !== this.value) {
            this.updateValue(value);
            this.updateHandleValue();
        }
    }

    public registerOnChange( fn: Function ): void {
        this.onModelChange = fn;
    }

    public registerOnTouched( fn: Function ): void {
        this.onModelTouched = fn;
    }

    public setDisabledState( isDisabled: boolean ): void {
    }

    private handleChange( event: any ): void {
        let handleValue = this.calculateHandleValue(event);
        this.setValueFromHandle(event, handleValue);
        return;
    }

    private calculateHandleValue( event: any ): number {
        return Math.floor(((this.initY + this.sliderHeight) - event.pageY) * 100 / (this.sliderHeight));
    }

    private setValueFromHandle( event: any, handleValue: number ): void {
        let newValue = this.getValueFromHandle(handleValue);
        this.handleValue = handleValue;
        this.updateValue(newValue, event);
        return;
    }

    private getValueFromHandle( handleValue: number ): number {
        return (this.max - this.min) * (handleValue / 100) + this.min;
    }

    private updateHandleValue(): void {
        if (this.value < this.min) {
            this.handleValue = 0;
        } else if (this.value > this.max) {
            this.handleValue = 100;
        } else {
            this.handleValue = (this.value - this.min) * 100 / (this.max - this.min);
        }
        return;
    }

    private updateValue( val: number, event?: any ): void {
        if (val < this.min) {
            val = this.min;
            this.handleValue = 0;
        } else if (val > this.max) {
            val = this.max;
            this.handleValue = 100;
        }
        this.value = Math.floor(val);
        this.onModelChange(this.value);
    }

    public getWindowScrollTop(): number {
        let doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }
}
