import {
    Directive,
    ElementRef,
    HostListener,
    OnInit,
    Input,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[numberValidator]',
})
export class NumberValidatorDirective implements OnInit {
    private regex = new RegExp(/^([0-9])+$/i);
    @Input() maxNumber: number;
    constructor(private el: ElementRef, private control: NgControl) {}

    ngOnInit(): void {
        (this.control.control as any).nativeElement = this.el.nativeElement;
    }

    @HostListener('input', ['$event']) onKeyPress(event: any) {
        this.validator();
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        setTimeout(() => {
            this.validator();
            event.preventDefault();
        }, 100);
    }

    validator() {
        let value = this.el.nativeElement.value;
        const res = this.regex.test(value);
        if (value && !res) {
            this.control.control.setValue(value.substring(0, value.length - 1));
        } else if (res && parseInt(value) > this.maxNumber) {
            this.control.control.setValue('00');
        }
    }
}
