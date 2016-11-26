/**
 * date-picker.component.spec
 */
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { DatePickerComponent } from "./date-picker.component";
import { By } from "@angular/platform-browser";
import { MomentPipe } from "../pipes/moment.pipe";
import { ModalComponent } from "../picker-modal/modal.component";
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';

describe('DatePickerComponent', () => {

    let comp: DatePickerComponent;
    let fixture: ComponentFixture<DatePickerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                DatePickerComponent,
                ModalComponent,
                MomentPipe
            ]
        });

        fixture = TestBed.createComponent(DatePickerComponent);

        comp = fixture.componentInstance; // DatePickerComponent test instance
    });

    it('should display "Sun" as the first weekday', () => {
        fixture.detectChanges();
        let weekDaysEl = fixture.debugElement.queryAll(By.css('.picker-weekday'));
        expect(weekDaysEl[0].nativeElement.textContent).toBe('Sun');
    });

    it('should display "Mon" as the first weekday if the firstWeekDayMonday variable set to be true', () => {
        comp.firstWeekDayMonday = true;
        fixture.detectChanges();
        let weekDaysEl = fixture.debugElement.queryAll(By.css('.picker-weekday'));
        expect(weekDaysEl[0].nativeElement.textContent).toBe('Mon');
    });

    it('should display display 42 picker days', () => {
        fixture.detectChanges();
        let pickerDayEls = fixture.debugElement.queryAll(By.css('.picker-day'));
        expect(pickerDayEls.length).toBe(42);
    });

    it('should have a button named "Today"', () => {
        let todayBtnEl = fixture.debugElement.query(By.css('.action-today'));
        expect(todayBtnEl.nativeElement.textContent).toBe('Today');
    });

    it('should raise onSelectDate event when "Today" button clicked', () => {
        let selectedDateValue: string;
        comp.onSelectDate.subscribe(( date: string ) => selectedDateValue = date);
        let todayBtnEl = fixture.debugElement.query(By.css('.action-today'));
        todayBtnEl.triggerEventHandler('click', null);
        expect(selectedDateValue).toBe(moment().format(comp.viewFormat));
    });

    it('should have a button named "Clear"', () => {
        let clearBtnEl = fixture.debugElement.query(By.css('.action-clear'));
        expect(clearBtnEl.nativeElement.textContent).toBe('Clear');
    });

    it('should raise onSelectDate event when "Clear" button clicked', () => {
        let selectedDateValue: string;
        comp.onSelectDate.subscribe(( date: string ) => selectedDateValue = date);
        let clearBtnEl = fixture.debugElement.query(By.css('.action-clear'));
        clearBtnEl.triggerEventHandler('click', null);
        expect(selectedDateValue).toBeNull();
    });

    it('should have a button named "Close"', () => {
        let closeBtnEl = fixture.debugElement.query(By.css('.action-close'));
        expect(closeBtnEl.nativeElement.textContent).toBe('Close');
    });

    it('should raise onDatePickerCancel event when "Close" button clicked', () => {
        let pickerStatus: boolean;
        comp.onDatePickerCancel.subscribe(( status: boolean ) => pickerStatus = status);
        let closeBtnEl = fixture.debugElement.query(By.css('.action-close'));
        closeBtnEl.triggerEventHandler('click', null);
        expect(pickerStatus).toBeFalsy();
    });

    it('should display current month if the initDate is not set', () => {
        fixture.detectChanges();
        expect(comp.initDate).toBeUndefined();
        let monthEl = fixture.debugElement.query(By.css('.month'));
        expect(monthEl.nativeElement.textContent).toBe(moment().format('MMMM'));
    });

    it('should display initDate\'s month if the initDate is set', () => {
        let displayMonthValue = moment().add(1, 'm').format('MMMM')
        comp.initDate = moment().add(1, 'm').format(comp.viewFormat);
        fixture.detectChanges();
        expect(comp.initDate).toBeDefined();
        let monthEl = fixture.debugElement.query(By.css('.month'));
        expect(monthEl.nativeElement.textContent).toBe(displayMonthValue);
    });

    it('should display current year if the initDate is not set', () => {
        fixture.detectChanges();
        expect(comp.initDate).toBeUndefined();
        let yearEl = fixture.debugElement.query(By.css('.year'));
        expect(yearEl.nativeElement.textContent).toBe(moment().format('YYYY'));
    });

    it('should display initDate\'s year if the initDate is set', () => {
        let displayYearValue = moment().add(1, 'y').format('YYYY');
        comp.initDate = moment().add(1, 'y').format(comp.viewFormat);
        fixture.detectChanges();
        expect(comp.initDate).toBeDefined();
        let yearEl = fixture.debugElement.query(By.css('.year'));
        expect(yearEl.nativeElement.textContent).toBe(displayYearValue);
    });

    it('should display next month calendar if the nav-next button was clicked', () => {
        comp.initDate = moment().format(comp.viewFormat);
        fixture.detectChanges();

        let navNextEl = fixture.debugElement.query(By.css('.nav-next'));
        navNextEl.triggerEventHandler('click', null);

        let monthEl = fixture.debugElement.query(By.css('.month'));
        expect(monthEl.nativeElement.textContent).toBe(moment().add(1, 'm').format('MMMM'));
    });

    it('should display previous month calendar if the nav-prev button was clicked', () => {
        comp.initDate = moment().format(comp.viewFormat);
        fixture.detectChanges();

        let navNextEl = fixture.debugElement.query(By.css('.nav-prev'));
        navNextEl.triggerEventHandler('click', null);

        let monthEl = fixture.debugElement.query(By.css('.month'));
        expect(monthEl.nativeElement.textContent).toBe(moment().subtract(1, 'm').format('MMMM'));
    });

    it('should set selected picker-day element to has "selected" class', () => {
        let selectedIndex: number;
        let initMoment = moment().add(1, 'd');
        comp.initDate = initMoment.format(comp.viewFormat);
        fixture.detectChanges();
        comp.calendarDays.map(( day: Moment, index: number ) => {
            if (day.format(comp.viewFormat) === initMoment.format(comp.viewFormat)) {
                selectedIndex = index;
            }
        });
        expect(selectedIndex).toBeDefined();
        let allPickerDayEl = fixture.debugElement.queryAll(By.css('.picker-day'));
        expect(allPickerDayEl[selectedIndex].nativeElement.className).toContain('selected');
    });

    it('should set today picker-day element to has "today" class', () => {
        let todayIndex: number;
        let todayMoment = moment();
        comp.initDate = todayMoment.format(comp.viewFormat);
        fixture.detectChanges();
        comp.calendarDays.map(( day: Moment, index: number ) => {
            if (day.format(comp.viewFormat) === todayMoment.format(comp.viewFormat)) {
                todayIndex = index;
            }
        });
        expect(todayIndex).toBeDefined();
        let allPickerDayEl = fixture.debugElement.queryAll(By.css('.picker-day'));
        expect(allPickerDayEl[todayIndex].nativeElement.className).toContain('today');
    });

    it('should set not-current-month picker-day elements to has "out-focus" class', () => {
        let notCurrentMonthDaysIndex: number[] = [];
        let todayMoment = moment();
        comp.initDate = todayMoment.format(comp.viewFormat);
        fixture.detectChanges();
        comp.calendarDays.map(( day: Moment, index: number ) => {
            if (day.format('MMMM') != todayMoment.format('MMMM')) {
                notCurrentMonthDaysIndex.push(index);
            }
        });
        let allPickerDayEl = fixture.debugElement.queryAll(By.css('.picker-day'));
        notCurrentMonthDaysIndex.map((i: number) => {
            expect(allPickerDayEl[i].nativeElement.className).toContain('out-focus');
        });
    });
});