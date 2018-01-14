/**
 * calendar-body.component
 */

import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

export class CalendarCell {
    constructor( public value: number,
                 public displayValue: string,
                 public ariaLabel: string,
                 public enabled: boolean,
                 public out: boolean = false ) {
    }
}

@Component({
    selector: '[owl-date-time-calendar-body]',
    exportAs: 'owlDateTimeCalendarBody',
    templateUrl: './calendar-body.component.html',
    styleUrls: ['./calendar-body.component.scss'],
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OwlCalendarBodyComponent implements OnInit {

    /**
     * The cell number of the active cell in the table.
     * @default {0}
     * @type {number}
     * */
    @Input() activeCell = 0;

    /**
     * When specify to true, a disabled cell could be selected
     * @default {false}
     * @type {boolean}
     * */
    @Input() allowDisabledCellSelection = false;

    /**
     * The cells to display in the table.
     * */
    @Input() rows: CalendarCell[][];

    /**
     * The number of columns in the table.
     * */
    @Input() numCols = 7;

    /**
     * The ratio (width / height) to use for the cells in the table.
     */
    @Input() cellRatio = 1;

    /**
     * The value in the table that corresponds to today.
     * */
    @Input() todayValue: number;

    /**
     * The value in the table that is currently selected.
     * */
    @Input() selectedValues: number[];

    /**
     * Current picker select mode
     * @type {'single' | 'range'}
     * */
    @Input() selectMode: 'single' | 'range';

    /**
     * Callback when a new value is selected
     * */
    @Output() selectedValueChange = new EventEmitter<number>();

    @HostBinding('class.owl-dt-calendar-body')
    get owlDTCalendarBodyClass(): boolean {
        return true;
    }

    constructor() {
    }

    public ngOnInit() {
    }

    public cellClicked( cell: CalendarCell ): void {
        if (!this.allowDisabledCellSelection && !cell.enabled) {
            return;
        }

        this.selectedValueChange.emit(cell.value);
    }

    public isActiveCell( rowIndex: number, colIndex: number ): boolean {
        const cellNumber = rowIndex * this.numCols + colIndex;
        return cellNumber === this.activeCell;
    }

    /**
     * Check if the cell is selected
     * @param {number} value
     * @return {boolean}
     * */
    public isSelected( value: number ): boolean {

        if (!this.selectedValues || this.selectedValues.length === 0) {
            return false;
        }

        if (this.selectMode === 'single') {
            return value === this.selectedValues[0];
        }

        if (this.selectMode === 'range') {
            const fromValue = this.selectedValues[0];
            const toValue = this.selectedValues[1];

            if (fromValue !== null && toValue !== null) {
                return value >= fromValue && value <= toValue;
            } else {
                return value === fromValue || value === toValue;
            }
        }
    }
}
