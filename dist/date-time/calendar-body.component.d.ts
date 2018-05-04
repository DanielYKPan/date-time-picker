import { ElementRef, EventEmitter, NgZone, OnInit } from '@angular/core';
import { SelectMode } from './date-time.class';
export declare class CalendarCell {
    value: number;
    displayValue: string;
    ariaLabel: string;
    enabled: boolean;
    out: boolean;
    constructor(value: number, displayValue: string, ariaLabel: string, enabled: boolean, out?: boolean);
}
export declare class OwlCalendarBodyComponent implements OnInit {
    private elmRef;
    private ngZone;
    activeCell: number;
    allowDisabledCellSelection: boolean;
    rows: CalendarCell[][];
    numCols: number;
    cellRatio: number;
    todayValue: number;
    selectedValues: number[];
    selectMode: SelectMode;
    selectedValueChange: EventEmitter<number>;
    readonly owlDTCalendarBodyClass: boolean;
    readonly isInSingleMode: boolean;
    readonly isInRangeMode: boolean;
    constructor(elmRef: ElementRef, ngZone: NgZone);
    ngOnInit(): void;
    cellClicked(cell: CalendarCell): void;
    isActiveCell(rowIndex: number, colIndex: number): boolean;
    isSelected(value: number): boolean;
    isInRange(value: number): boolean;
    isRangeFrom(value: number): boolean;
    isRangeTo(value: number): boolean;
    focusActiveCell(): void;
}
