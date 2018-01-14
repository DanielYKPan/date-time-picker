/**
 * timer-box.component
 */

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ChangeDetectorRef, HostBinding
} from '@angular/core';

@Component({
    exportAs: 'owlDateTimeTimerBox',
    selector: 'owl-date-time-timer-box',
    templateUrl: './timer-box.component.html',
    styleUrls: ['./timer-box.component.scss'],
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OwlTimerBoxComponent implements OnInit, OnDestroy {

    @Input() showDivider = false;

    @Input() upBtnAriaLabel: string;

    @Input() upBtnDisabled: boolean;

    @Input() downBtnAriaLabel: string;

    @Input() downBtnDisabled: boolean;

    @Input() boxValue: number;

    @Input() min: number;

    @Input() max: number;

    @Input() step = 1;

    @Output() boxValueChange = new EventEmitter<number>();

    @HostBinding('class.owl-dt-timer-box')
    get owlDTTimerBoxClass(): boolean {
        return true;
    }

    constructor( private changeDetectorRef: ChangeDetectorRef ) {
    }

    public ngOnInit() {
    }

    public ngOnDestroy(): void {
    }

    public upBtnClicked(): void {
        this.updateBoxValue(this.boxValue + this.step);
    }

    public downBtnClicked(): void {
        this.updateBoxValue(this.boxValue - this.step);
    }

    private updateBoxValue( value: number ): void {
        if (value > this.max || value < this.min) {
            return;
        }
        this.boxValueChange.emit(value);
        this.changeDetectorRef.markForCheck();
    }
}
