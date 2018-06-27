import {
    AfterContentInit,
    ContentChild,
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    Renderer2
} from '@angular/core';
import {MatInput} from '@angular/material';

import {OwlDateTimeComponent} from './date-time-picker.component';
import {Subscription} from 'rxjs';

@Directive({
    selector: '[owlDateTimeMaterialTrigger]'
})
export class OwlDateTimeMaterialTriggerDirective<T> implements AfterContentInit, OnDestroy {

    @ContentChild(MatInput) private inputField: MatInput;
    @ContentChild(OwlDateTimeComponent) private odt: OwlDateTimeComponent<T>;
    private pickerClosedSub = Subscription.EMPTY;
    private pickerOpenedSub = Subscription.EMPTY;
    private originalReadOnly = false;

    @HostListener('click', ['$event']) onClick(e: Event): void {
        // trigger only if input field is not disabled
        if (this.odt && !this.inputField.disabled) {
            // don't allow input field to receive focus on click (reset to original setting after calendar is opened)
            this.originalReadOnly = this.inputField.readonly;
            this.inputField.readonly = true;

            // apply material classes to make field appear to have focus
            this.renderer.addClass(this.me.nativeElement, 'mat-form-field-should-float');
            this.renderer.addClass(this.me.nativeElement, 'mat-focused');

            this.odt.open();
            e.stopPropagation();
        }
    }

    @HostListener('window:resize') onWindowResize(): void {

        if (this.autoDialog && this.odt) {

            const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            let heightRequired;
            switch (this.odt.pickerType) {
                case 'calendar':
                    heightRequired = 324;
                    break;
                case 'timer':
                    heightRequired = 144;
                    break;
                default:
                    heightRequired = 468;
            }

            this.odt.pickerMode = (viewportHeight < heightRequired) ? 'dialog' : 'popup';

        }
    }

    /**
     * Enable automatic switching to dialog type based on viewport height
     * @type {boolean}
     */
    @Input() private autoDialog = false;

    constructor(private renderer: Renderer2, private me: ElementRef) {}

    ngAfterContentInit() {
        this.pickerOpenedSub = this.odt.afterPickerOpen.subscribe(() => {
            this.inputField.readonly = this.originalReadOnly;
        });
        this.pickerClosedSub = this.odt.afterPickerClosed.subscribe(() => {
            // if original readonly was true, remove the focus classes
            if (this.inputField.readonly) {
                if (this.inputField.value === '') {
                    this.renderer.removeClass(this.me.nativeElement, 'mat-form-field-should-float');
                }
                this.renderer.removeClass(this.me.nativeElement, 'mat-focused');
            }
        });
        this.onWindowResize();
    }

    ngOnDestroy() {
        if (this.pickerClosedSub) {
            this.pickerClosedSub.unsubscribe();
        }
        if (this.pickerOpenedSub) {
            this.pickerOpenedSub.unsubscribe();
        }
    }

}
