/**
 * picker.directive
 */

import {
    Directive, ElementRef, Input, ViewContainerRef,
    ReflectiveInjector, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ComponentFactoryResolver, forwardRef,
    OnDestroy, HostListener
} from '@angular/core';
import { DialogComponent } from './dialog.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const PICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimePickerDirective),
    multi: true
};

@Directive({
    selector: '[dateTimePicker]',
    host: {
        '(mousedown)': 'onClick($event)',
        '(touchdown)': 'onClick($event)',
    },
    providers: [PICKER_VALUE_ACCESSOR],
})
export class DateTimePickerDirective implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

    @Output('onChange') onChange = new EventEmitter<any>(true);
    @Output('onError') onError = new EventEmitter<any>(true);

    @Input() autoClose: boolean = false; // automatically close the picker after selecting
    @Input() disabled: boolean;
    @Input() locale: string = 'en';
    @Input() viewFormat: string = 'll';
    @Input() returnObject: string = 'js';
    @Input() mode: 'popup' | 'dropdown' | 'inline' = 'popup';
    @Input() hourTime: '12' | '24' = '24'; // determines the hour format (12 or 24)
    @Input() minMoment: string = null; // Min moment could be selected
    @Input() maxMoment: string = null; // Max moment could be selected
    @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'bottom'; // picker position in dropdown mode
    @Input() positionOffset: string = '0%';
    @Input() pickerType: 'both' | 'date' | 'time' = 'both';
    @Input() showSeconds: boolean = false;
    @Input() onlyCurrentMonth: boolean = false; // only show current month's days in calendar

    public onModelChange: Function = () => {
    };
    public onModelTouched: Function = () => {
    };

    private created: boolean = false;
    private dialog: any;
    private container: any;

    constructor( private vcRef: ViewContainerRef,
                 private componentFactoryResolver: ComponentFactoryResolver,
                 private el: ElementRef ) {
    }

    public ngOnChanges( changes: SimpleChanges ): void {
        if (changes['minMoment'] &&
            !changes['minMoment'].isFirstChange() ||
            changes['maxMoment'] &&
            !changes['maxMoment'].isFirstChange()) {
            this.dialog.resetMinMaxMoment(this.minMoment, this.maxMoment);
        }
    }

    public ngOnInit(): void {
        this.generateComponent();
        if (this.mode === 'inline') {
            this.openDialog();
        }
    }

    public ngOnDestroy(): void {
        this.dispose();
    }

    public writeValue( obj: any ): void {
        if (this.dialog) {
            this.dialog.setSelectedMoment(obj);
        }
    }

    public registerOnChange( fn: any ): void {
        this.onModelChange = fn;
    }

    public registerOnTouched( fn: any ): void {
        this.onModelTouched = fn;
    }

    public setDisabledState( isDisabled: boolean ): void {
        this.disabled = isDisabled;
        if (this.dialog) {
            this.dialog.setPickerDisableStatus(isDisabled);
        }
    }

    public onClick(event: Event): void {
        event.preventDefault();
        if (!this.disabled) {
            this.openDialog();
        }
    }

    public momentChanged( value: any ) {
        this.onModelChange(value);
        this.onModelTouched();
        this.onChange.emit(value);
    }

    /**
     * Emit an event indicating something wrong
     * @param error {any}
     * */
    public sendError( error: any ): void {
        this.onError.emit(error);
        return;
    }

    public dispose(): void {
        if (this.container) {
            this.container.destroy();
            this.container = null;
            return;
        }
        return;
    }

    private generateComponent():void {
        if (!this.container) {
            this.created = true;
            const factory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
            const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
            this.container = this.vcRef.createComponent(factory, 0, injector, []);
            this.container.instance.setDialog(this, this.el, this.autoClose,
                this.locale, this.viewFormat, this.returnObject, this.position,
                this.positionOffset, this.mode, this.hourTime, this.pickerType, this.showSeconds,
                this.onlyCurrentMonth, this.minMoment, this.maxMoment);
            this.dialog = this.container.instance;
        }
    }

    private openDialog(): void {
        if (this.dialog) {
            this.dialog.openDialog();
        }
    }
}
