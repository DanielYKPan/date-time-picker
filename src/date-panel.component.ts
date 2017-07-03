/**
 * date-panel.component
 */

import {
    Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy
} from '@angular/core';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { DialogType } from './dialog.component';
import { PickerService } from './picker.service';
import { shadeBlendConvert } from './utils';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'dialog-date-panel',
    templateUrl: './date-panel.component.html',
    styleUrls: ['./date-panel.component.scss'],
})
export class DatePanelComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public dialogType: DialogType;
    @Output() public onDialogTypeChange = new EventEmitter<DialogType>();
    @Output() public onClearPickerInput = new EventEmitter<boolean>();
    @Output() public onConfirm = new EventEmitter<boolean>();
    @Output() public onSelected = new EventEmitter<Moment>();

    public autoClose: boolean;
    public type: DialogType;
    public now: Moment;
    public todayIconColor: string;
    public selectedMoment: Moment;
    public calendarMoment: Moment;
    public calendarDays: Moment[];
    public dayNames: string[];
    public monthList: string[];
    public yearList: number[] = [];
    public mode: 'popup' | 'dropdown' | 'inline';
    public onlyCurrentMonth: boolean;

    private locale: string;
    private subId: Subscription;
    private momentFunc = (moment as any).default ? (moment as any).default : moment;

    constructor( private service: PickerService ) {
    }

    public ngOnChanges( changes: SimpleChanges ): void {
        if (changes['dialogType']) {
            this.type = changes['dialogType'].currentValue;
        }
    }

    public ngOnInit() {

        this.autoClose = this.service.dtAutoClose;
        this.locale = this.service.dtLocale;
        this.mode = this.service.dtMode;
        this.onlyCurrentMonth = this.service.dtOnlyCurrentMonth;
        this.todayIconColor = shadeBlendConvert(0.4, this.service.dtTheme);

        // set week days name array
        this.dayNames = this.momentFunc.localeData(this.service.dtLocale).weekdaysShort();
        // set month name array
        this.monthList = this.momentFunc.localeData(this.service.dtLocale).monthsShort();

        this.now = this.service.now;

        this.subId = this.service.selectedMomentChange.subscribe(
            ( data ) => {
                this.selectedMoment = data;
                this.setCalendarMoment(data);
                this.generateCalendar();
            }
        );
    }

    public ngOnDestroy(): void {
        this.subId.unsubscribe();
    }

    public prevMonth(): void {
        this.calendarMoment = this.calendarMoment.clone().subtract(1, 'M');
        this.generateCalendar();
    }

    public nextMonth(): void {
        this.calendarMoment = this.calendarMoment.clone().add(1, 'M');
        this.generateCalendar();
    }

    public selectMonth( month: string ): void {
        this.calendarMoment = this.calendarMoment.clone().month(month);
        this.generateCalendar();
        this.toggleDialogType(DialogType.Month);
        return;
    }

    public selectYear( year: number ): void {
        this.calendarMoment = this.calendarMoment.clone().year(year);
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
            start = +this.calendarMoment.clone().subtract(4, 'y').format('YYYY');
        }

        for (let i = 0; i < 9; i++) {
            this.yearList[i] = start + i;
        }
        return;
    }

    public select( moment: Moment ): void {
        if (!moment) {
            return;
        } else if (this.selectedMoment &&
            this.selectedMoment.clone().startOf('date') === moment) {
            return;
        }

        this.onSelected.emit(moment);
    }

    public selectToday(): void {
        this.select(this.now);
    }

    public confirm(): void {
        this.onConfirm.emit(true);
        return;
    }

    public clearPickerInput(): void {
        this.onClearPickerInput.emit(true);
        return;
    }

    public isToday(day: Moment): boolean {
        return this.service.isTheSameDay(day, this.now);
    }

    private setCalendarMoment(moment: Moment): void {
        if (moment) {
            // if the param moment's year and month are the same as generated calendar's year and month
            // we don't regenerate the calendar
            if (this.calendarMoment &&
                moment.year() === this.calendarMoment.year()
                && moment.month() === this.calendarMoment.month()) {
                return;
            } else {
                this.calendarMoment = moment.clone();
            }
        } else {
            this.calendarMoment = this.momentFunc();
        }
    }

    private generateCalendar(): void {
        this.calendarDays = []; // clear the calendarDays array
        let start = 0 - (this.calendarMoment.clone().startOf('month').day() +
            (7 - this.momentFunc.localeData().firstDayOfWeek())) % 7;
        let end = 41 + start; // iterator ending point

        for (let i = start; i <= end; i += 1) {
            let day = this.calendarMoment.clone().startOf('month').add(i, 'days');
            if (this.onlyCurrentMonth && !day.isSame(this.calendarMoment, 'month')) {
                day = null;
            }
            this.calendarDays.push(day);
        }
    }
}

