/**
 * date-panel.component
 */

import {
    Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges
} from '@angular/core';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { DialogType } from './dialog.component';
import { PickerService } from './picker.service';
import { shadeBlendConvert } from './utils';

@Component({
    selector: 'dialog-date-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './date-panel.component.html',
    styleUrls: ['./date-panel.component.scss'],
})
export class DatePanelComponent implements OnInit, OnChanges {

    @Input() public selectedMoment: Moment;
    @Input() public dialogType: DialogType;
    @Output() public onDialogTypeChange = new EventEmitter<DialogType>();
    @Output() public onCancelDialog = new EventEmitter<boolean>();
    @Output() public onConfirm = new EventEmitter<boolean>();
    @Output() public onSelected = new EventEmitter<Moment>();

    public type: DialogType;
    public now: Moment;
    public moment: Moment;
    public calendarDays: Moment[];
    public dayNames: string[];
    public monthList: string[];
    public yearList: number[] = [];
    public mode: 'popup' | 'dropdown' | 'inline';
    public onlyCurrent: boolean;
    public todayIconColor: string;
    public minDate: string;
    public maxDate: string;

    private locale: string;
    private momentFunc = (moment as any).default ? (moment as any).default : moment;

    constructor( private service: PickerService ) {
    }

    public ngOnChanges( changes: SimpleChanges ): void {
        if (changes['dialogType']) {
            this.type = changes['dialogType'].currentValue;
        }
    }

    public ngOnInit() {

        this.locale = this.service.dtLocale;
        this.minDate = this.service.dtMinDate;
        this.maxDate = this.service.dtMaxDate;
        this.mode = this.service.dtMode;
        this.onlyCurrent = this.service.dtOnlyCurrent;
        this.todayIconColor = shadeBlendConvert(0.4, this.service.dtTheme);

        // set moment locale (default is en)
        this.momentFunc.locale(this.locale);

        // set week days name array
        this.dayNames = this.momentFunc.weekdaysShort(true);
        // set month name array
        this.monthList = this.momentFunc.monthsShort();

        this.now =this.momentFunc();
        this.moment = this.service.moment;
        this.generateCalendar();
    }
	private compare = function(day: any){
        if(this.minDate){
            if(moment(day.format()).isBefore(moment(this.minDate).format('YYYY-MM-DD'))){
                return true;
            }
        }
        if(this.maxDate){
            if(moment(day.format()).isAfter(moment(this.maxDate).format('YYYY-MM-DD'))){
                return true;
            }
        }
        return false;
    }
    public prevMonth(): void {
        this.moment = this.moment.clone().subtract(1, 'M');
        this.generateCalendar();
    }

    public nextMonth(): void {
        this.moment = this.moment.clone().add(1, 'M');
        this.generateCalendar();
    }

    public selectMonth( month: string ): void {
        this.moment = this.moment.clone().month(month);
        this.generateCalendar();
        this.toggleDialogType(DialogType.Month);
        return;
    }

    public selectYear( year: number ): void {
        this.moment = this.moment.clone().year(year);
        this.generateCalendar();
        this.toggleDialogType(DialogType.Year);
        return;
    }

    public toggleDialogType( type: DialogType ): void {
        this.onDialogTypeChange.emit(type);
        if (type === DialogType.Year) {
            this.generateYearList();
        }
        return;
    }

    public generateYearList( param?: string ): void {
        let start;

        if (param === 'prev') {
            start = this.yearList[0] - 9;
        } else if (param === 'next') {
            start = this.yearList[8] + 1;
        } else {
            start = +this.moment.clone().subtract(4, 'y').format('YYYY');
        }

        for (let i = 0; i < 9; i++) {
            this.yearList[i] = start + i;
        }
        return;
    }

    public select( moment: Moment ): void {
        if (!moment) {
            return;
        }
        if (this.selectedMoment &&
            this.selectedMoment.clone().startOf('date') === moment) {
            return;
        }

        if (moment.year() !== this.moment.year() ||
            moment.month() !== this.moment.month()) {
            this.moment = moment.clone();
            this.generateCalendar();
        }
        this.onSelected.emit(moment);
    }

    public selectToday(): void {
        this.select(this.now);
    }

    public cancelDialog(): void {
        this.onCancelDialog.emit(true);
        return;
    }

    public confirm(): void {
        this.onConfirm.emit(true);
        return;
    }

    private generateCalendar(): void {
        this.calendarDays = [];
        let start = 0 - (this.moment.clone().startOf('month').day() + (7 - this.momentFunc.localeData().firstDayOfWeek())) % 7;
        let end = 41 + start; // iterator ending point

        for (let i = start; i <= end; i += 1) {
            let day = this.moment.clone().startOf('month').add(i, 'days');
            if (this.onlyCurrent && !day.isSame(this.moment, 'month')) {
                day = null;
            }
            this.calendarDays.push(day);
        }
    }
}

