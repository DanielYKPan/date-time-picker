"use strict";
var testing_1 = require("@angular/core/testing");
var time_picker_component_1 = require("./time-picker.component");
var modal_component_1 = require("../picker-modal/modal.component");
var moment_pipe_1 = require("../pipes/moment.pipe");
var platform_browser_1 = require("@angular/platform-browser");
var moment = require("moment/moment");
describe('TimePickerComponent', function () {
    var comp;
    var fixture;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                time_picker_component_1.TimePickerComponent,
                modal_component_1.ModalComponent,
                moment_pipe_1.MomentPipe
            ]
        });
        fixture = testing_1.TestBed.createComponent(time_picker_component_1.TimePickerComponent);
        comp = fixture.componentInstance;
    });
    it('should display "Time Picker" as the picker header', function () {
        fixture.detectChanges();
        var pickerHeader = fixture.debugElement.query(platform_browser_1.By.css('.picker-header'));
        expect(pickerHeader.nativeElement.textContent).toBe("Time Picker");
    });
    it('should have a button named "Now"', function () {
        var nowBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-now'));
        expect(nowBtnEl.nativeElement.textContent).toBe('Now');
    });
    it('should raise onSelectTime event when "Now" button clicked', function () {
        var selectedTimeValue;
        comp.onSelectTime.subscribe(function (time) { return selectedTimeValue = time; });
        comp.returnObject = 'string';
        var nowBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-now'));
        nowBtnEl.triggerEventHandler('click', null);
        expect(selectedTimeValue).toBe(moment().format(comp.viewFormat));
    });
    it('should have a button named "Confirm"', function () {
        var confirmBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-confirm'));
        expect(confirmBtnEl.nativeElement.textContent).toBe('Confirm');
    });
    it('should raise onSelectTime event when "Confirm" button clicked', function () {
        var selectedTimeValue;
        var initTimeMoment = moment().add(1, 'h');
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        comp.onSelectTime.subscribe(function (time) { return selectedTimeValue = time; });
        var confirmBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-confirm'));
        confirmBtnEl.triggerEventHandler('click', null);
        expect(selectedTimeValue).toBe(initTimeMoment.format(comp.viewFormat));
    });
    it('should have a button named "Clear"', function () {
        var clearBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-clear'));
        expect(clearBtnEl.nativeElement.textContent).toBe('Clear');
    });
    it('should raise onSelectTime event when "Clear" button clicked', function () {
        var selectedTimeValue;
        comp.onSelectTime.subscribe(function (time) { return selectedTimeValue = time; });
        var clearBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-clear'));
        clearBtnEl.triggerEventHandler('click', null);
        expect(selectedTimeValue).toBeNull();
    });
    it('should have a button named "Close"', function () {
        var closeBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-close'));
        expect(closeBtnEl.nativeElement.textContent).toBe('Close');
    });
    it('should raise onTimePickerCancel event when "Close" button clicked', function () {
        var timePickerStatus;
        comp.onTimePickerCancel.subscribe(function (status) { return timePickerStatus = status; });
        var closeBtnEl = fixture.debugElement.query(platform_browser_1.By.css('.action-close'));
        closeBtnEl.triggerEventHandler('click', null);
        expect(timePickerStatus).toBeFalsy();
    });
    it('should show second element as default', function () {
        fixture.detectChanges();
        var secondEl = fixture.debugElement.query(platform_browser_1.By.css('.second'));
        expect(secondEl).toBeTruthy();
    });
    it('should not show second element if showSecond variable set to be false', function () {
        comp.showSecond = false;
        fixture.detectChanges();
        var secondEl = fixture.debugElement.query(platform_browser_1.By.css('.second'));
        expect(secondEl).toBeFalsy();
    });
    it('should not show meridiem element as default', function () {
        fixture.detectChanges();
        var meridiemEl = fixture.debugElement.query(platform_browser_1.By.css('.meridiem'));
        expect(meridiemEl).toBeFalsy();
    });
    it('should show meridiem element if use12Hour variable set to be true', function () {
        comp.use12Hour = true;
        fixture.detectChanges();
        var meridiemEl = fixture.debugElement.query(platform_browser_1.By.css('.meridiem'));
        expect(meridiemEl).toBeTruthy();
    });
    it('should increase one hour if hour arrow up element was clicked', function () {
        var initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        var hourArrowUpEl = fixture.debugElement.query(platform_browser_1.By.css('.hour .arrow.up'));
        var hourEl = fixture.debugElement.query(platform_browser_1.By.css('.hour'));
        hourArrowUpEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(hourEl.nativeElement.textContent).toContain(initTimeMoment.add(1, 'h').format(comp.hourFormat));
    });
    it('should decrease one hour if hour arrow down element was clicked', function () {
        var initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        var hourArrowDownEl = fixture.debugElement.query(platform_browser_1.By.css('.hour .arrow.down'));
        var hourEl = fixture.debugElement.query(platform_browser_1.By.css('.hour'));
        hourArrowDownEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(hourEl.nativeElement.textContent).toContain(initTimeMoment.subtract(1, 'h').format(comp.hourFormat));
    });
    it('should increase one minute if minute arrow up element was clicked', function () {
        var initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        var minuteArrowUpEl = fixture.debugElement.query(platform_browser_1.By.css('.minute .arrow.up'));
        var minuteEl = fixture.debugElement.query(platform_browser_1.By.css('.minute'));
        minuteArrowUpEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(minuteEl.nativeElement.textContent).toContain(initTimeMoment.add(1, 'm').format('mm'));
    });
    it('should decrease one minute if minute arrow down element was clicked', function () {
        var initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        var minuteArrowDownEl = fixture.debugElement.query(platform_browser_1.By.css('.minute .arrow.down'));
        var minuteEl = fixture.debugElement.query(platform_browser_1.By.css('.minute'));
        minuteArrowDownEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(minuteEl.nativeElement.textContent).toContain(initTimeMoment.subtract(1, 'm').format('mm'));
    });
    it('should increase one second if second arrow up element was clicked', function () {
        var initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        var secondArrowUpEl = fixture.debugElement.query(platform_browser_1.By.css('.second .arrow.up'));
        var secondEl = fixture.debugElement.query(platform_browser_1.By.css('.second'));
        expect(secondEl.nativeElement.textContent).toContain('00');
        secondArrowUpEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(secondEl.nativeElement.textContent).toContain('01');
    });
    it('should decrease one second if second arrow down element was clicked', function () {
        var initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        var secondArrowDownEl = fixture.debugElement.query(platform_browser_1.By.css('.second .arrow.down'));
        var secondEl = fixture.debugElement.query(platform_browser_1.By.css('.second'));
        expect(secondEl.nativeElement.textContent).toContain('00');
        secondArrowDownEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(secondEl.nativeElement.textContent).toContain('59');
    });
});

//# sourceMappingURL=time-picker.component.spec.js.map
