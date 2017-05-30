/**
 * picker.directive
 */

import {
    Directive, ElementRef, Input, ViewContainerRef,
    ReflectiveInjector, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ComponentFactoryResolver
} from '@angular/core';
import { DialogComponent } from './dialog.component';

@Directive({
    selector: '[dateTimePicker]',
    host: {
        '(click)': 'onClick()',
    }
})
export class DateTimePickerDirective implements OnInit, OnChanges {

    @Input('dateTimePicker') dateTimePicker: any;
    @Output('dateTimePickerChange') dateTimePickerChange = new EventEmitter<any>(true);
    @Input() locale: string = 'en';
    @Input() viewFormat: string = 'll';
    @Input() returnObject: string = 'js';
    @Input() mode: 'popup' | 'dropdown' | 'inline' = 'popup';
    @Input() hourTime: '12' | '24' = '24'; // determines the hour format (12 or 24)
    @Input() theme: string = '#0070ba'; // theme color
    @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'bottom'; // picker position in dropdown mode
    @Input() positionOffset: string = '0%';
    @Input() pickerType: 'both' | 'date' | 'time' = 'both';
    @Input() showSeconds: boolean = false;
    @Input() onlyCurrent: boolean = false;
	@Input() minDate: any;
    @Input() maxDate: any;

    private created: boolean = false;
    private dialog: any;

    constructor( private vcRef: ViewContainerRef,
                 private componentFactoryResolver: ComponentFactoryResolver,
                 private el: ElementRef ) {
    }

    public ngOnChanges( changes: SimpleChanges ): void {
        if (this.mode === 'inline' &&
            changes['dateTimePicker'] &&
            !changes['dateTimePicker'].isFirstChange()) {
            this.dialog.setSelectedMoment(this.dateTimePicker);
        }
    }

    public ngOnInit(): void {
        if (this.mode === 'inline') {
            this.openDialog();
        }
    }

    public onClick(): void {
        this.openDialog();
    }

    public momentChanged( value: any ) {
        this.dateTimePickerChange.emit(value);
    }

    private openDialog(): void {
        if (!this.created) {
            this.created = true;
            const factory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
            const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
            const cmpRef = this.vcRef.createComponent(factory, 0, injector, []);
            cmpRef.instance.setDialog(this, this.el, this.dateTimePicker, this.locale, this.viewFormat, this.returnObject, this.position,
                this.positionOffset, this.mode, this.hourTime, this.theme, this.pickerType, this.showSeconds, this.onlyCurrent, this.minDate, this.maxDate);
            this.dialog = cmpRef.instance;
        } else if (this.dialog) {
            this.dialog.openDialog(this.dateTimePicker, this.minDate, this.maxDate);
        }
    }
}
