"use strict";
var testing_1 = require("@angular/core/testing");
var date_picker_component_1 = require("./date-picker.component");
var platform_browser_1 = require("@angular/platform-browser");
var moment_pipe_1 = require("../pipes/moment.pipe");
var modal_component_1 = require("../picker-modal/modal.component");
var moment = require('moment/moment');
describe('DatePickerComponent', function () {
    var comp;
    var fixture;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                date_picker_component_1.DatePickerComponent,
                modal_component_1.ModalComponent,
                moment_pipe_1.MomentPipe
            ]
        });
        fixture = testing_1.TestBed.createComponent(date_picker_component_1.DatePickerComponent);
        comp = fixture.componentInstance;
    });
    it('should display "Sun" as the first weekday', function () {
        fixture.detectChanges();
        var weekDaysEl = fixture.debugElement.queryAll(platform_browser_1.By.css('.picker-weekday'));
        expect(weekDaysEl[0].nativeElement.textContent).toBe('Sun');
    });
    it('should display "Mon" as the first weekday if the firstWeekDayMonday variable set to be true', function () {
        comp.firstWeekDayMonday = true;
        fixture.detectChanges();
        var weekDaysEl = fixture.debugElement.queryAll(platform_browser_1.By.css('.picker-weekday'));
        expect(weekDaysEl[0].nativeElement.textContent).toBe('Mon');
    });
    it('should display display 42 picker days', function () {
        fixture.detectChanges();
        var pickerDayEls = fixture.debugElement.queryAll(platform_browser_1.By.css('.picker-day'));
        expect(pickerDayEls.length).toBe(42);
    });
    it('should have a button named "Today"', function () {
        var todayBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-today'));
        expect(todayBtnEl.nativeElement.textContent).toBe('Today');
    });
    it('should raise onSelectDate event when "Today" button clicked', function () {
        var selectedDateValue;
        comp.onSelectDate.subscribe(function (date) { return selectedDateValue = date; });
        var todayBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-today'));
        todayBtnEl.triggerEventHandler('click', null);
        expect(selectedDateValue).toBe(moment().format(comp.viewFormat));
    });
    it('should have a button named "Clear"', function () {
        var clearBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-clear'));
        expect(clearBtnEl.nativeElement.textContent).toBe('Clear');
    });
    it('should raise onSelectDate event when "Clear" button clicked', function () {
        var selectedDateValue;
        comp.onSelectDate.subscribe(function (date) { return selectedDateValue = date; });
        var clearBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-clear'));
        clearBtnEl.triggerEventHandler('click', null);
        expect(selectedDateValue).toBeNull();
    });
    it('should have a button named "Close"', function () {
        var closeBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-close'));
        expect(closeBtnEl.nativeElement.textContent).toBe('Close');
    });
    it('should raise onDatePickerCancel event when "Close" button clicked', function () {
        var pickerStatus;
        comp.onDatePickerCancel.subscribe(function (status) { return pickerStatus = status; });
        var closeBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-close'));
        closeBtnEl.triggerEventHandler('click', null);
        expect(pickerStatus).toBeFalsy();
    });
    it('should display current month if the initDate is not set', function () {
        fixture.detectChanges();
        expect(comp.initDate).toBeUndefined();
        var monthEl = fixture.debugElement.query(platform_browser_1.By.css('.month'));
        expect(monthEl.nativeElement.textContent).toBe(moment().format('MMMM'));
    });
    it('should display initDate\'s month if the initDate is set', function () {
        var displayMonthValue = moment().add(1, 'm').format('MMMM');
        comp.initDate = moment().add(1, 'm').format(comp.viewFormat);
        fixture.detectChanges();
        expect(comp.initDate).toBeDefined();
        var monthEl = fixture.debugElement.query(platform_browser_1.By.css('.month'));
        expect(monthEl.nativeElement.textContent).toBe(displayMonthValue);
    });
    it('should display current year if the initDate is not set', function () {
        fixture.detectChanges();
        expect(comp.initDate).toBeUndefined();
        var yearEl = fixture.debugElement.query(platform_browser_1.By.css('.year'));
        expect(yearEl.nativeElement.textContent).toBe(moment().format('YYYY'));
    });
    it('should display initDate\'s year if the initDate is set', function () {
        var displayYearValue = moment().add(1, 'y').format('YYYY');
        comp.initDate = moment().add(1, 'y').format(comp.viewFormat);
        fixture.detectChanges();
        expect(comp.initDate).toBeDefined();
        var yearEl = fixture.debugElement.query(platform_browser_1.By.css('.year'));
        expect(yearEl.nativeElement.textContent).toBe(displayYearValue);
    });
    it('should display next month calendar if the nav-next button was clicked', function () {
        comp.initDate = moment().format(comp.viewFormat);
        fixture.detectChanges();
        var navNextEl = fixture.debugElement.query(platform_browser_1.By.css('.nav-next'));
        navNextEl.triggerEventHandler('click', null);
        var monthEl = fixture.debugElement.query(platform_browser_1.By.css('.month'));
        expect(monthEl.nativeElement.textContent).toBe(moment().add(1, 'm').format('MMMM'));
    });
    it('should display previous month calendar if the nav-prev button was clicked', function () {
        comp.initDate = moment().format(comp.viewFormat);
        fixture.detectChanges();
        var navNextEl = fixture.debugElement.query(platform_browser_1.By.css('.nav-prev'));
        navNextEl.triggerEventHandler('click', null);
        var monthEl = fixture.debugElement.query(platform_browser_1.By.css('.month'));
        expect(monthEl.nativeElement.textContent).toBe(moment().subtract(1, 'm').format('MMMM'));
    });
    it('should set selected picker-day element to has "selected" class', function () {
        var selectedIndex;
        var initMoment = moment().add(1, 'd');
        comp.initDate = initMoment.format(comp.viewFormat);
        fixture.detectChanges();
        comp.calendarDays.map(function (day, index) {
            if (day.format(comp.viewFormat) === initMoment.format(comp.viewFormat)) {
                selectedIndex = index;
            }
        });
        expect(selectedIndex).toBeDefined();
        var allPickerDayEl = fixture.debugElement.queryAll(platform_browser_1.By.css('.picker-day'));
        expect(allPickerDayEl[selectedIndex].nativeElement.className).toContain('selected');
    });
    it('should set today picker-day element to has "today" class', function () {
        var todayIndex;
        var todayMoment = moment();
        comp.initDate = todayMoment.format(comp.viewFormat);
        fixture.detectChanges();
        comp.calendarDays.map(function (day, index) {
            if (day.format(comp.viewFormat) === todayMoment.format(comp.viewFormat)) {
                todayIndex = index;
            }
        });
        expect(todayIndex).toBeDefined();
        var allPickerDayEl = fixture.debugElement.queryAll(platform_browser_1.By.css('.picker-day'));
        expect(allPickerDayEl[todayIndex].nativeElement.className).toContain('today');
    });
    it('should set not-current-month picker-day elements to has "out-focus" class', function () {
        var notCurrentMonthDaysIndex = [];
        var todayMoment = moment();
        comp.initDate = todayMoment.format(comp.viewFormat);
        fixture.detectChanges();
        comp.calendarDays.map(function (day, index) {
            if (day.format('MMMM') != todayMoment.format('MMMM')) {
                notCurrentMonthDaysIndex.push(index);
            }
        });
        var allPickerDayEl = fixture.debugElement.queryAll(platform_browser_1.By.css('.picker-day'));
        notCurrentMonthDaysIndex.map(function (i) {
            expect(allPickerDayEl[i].nativeElement.className).toContain('out-focus');
        });
    });
});

//# sourceMappingURL=date-picker.component.spec.js.map
