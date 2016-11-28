/**
 * time-picker.component.spec
 */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TimePickerComponent } from "./time-picker.component";
import { ModalComponent } from "../picker-modal/modal.component";
import { MomentPipe } from "../pipes/moment.pipe";
import { By } from "@angular/platform-browser";
import * as moment from 'moment/moment';

describe('TimePickerComponent', () => {
    let comp: TimePickerComponent;
    let fixture: ComponentFixture<TimePickerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TimePickerComponent,
                ModalComponent,
                MomentPipe
            ]
        });

        fixture = TestBed.createComponent(TimePickerComponent);

        comp = fixture.componentInstance; // TimePickerComponent test instance
    });

    it('should display "Time Picker" as the picker header', () => {
        fixture.detectChanges();
        let pickerHeader = fixture.debugElement.query(By.css('.picker-header'));
        expect(pickerHeader.nativeElement.textContent).toBe("Time Picker");
    });

    it('should have a button named "Now"', () => {
        let nowBtnEl = fixture.debugElement.query(By.css('.action-now'));
        expect(nowBtnEl.nativeElement.textContent).toBe('Now');
    });

    it('should raise onSelectTime event when "Now" button clicked', () => {
        let selectedTimeValue: string;
        comp.onSelectTime.subscribe(( time: string ) => selectedTimeValue = time);
        comp.returnObject = 'string';
        let nowBtnEl = fixture.debugElement.query(By.css('.action-now'));
        nowBtnEl.triggerEventHandler('click', null);
        expect(selectedTimeValue).toBe(moment().format(comp.viewFormat));
    });

    it('should have a button named "Confirm"', () => {
        let confirmBtnEl = fixture.debugElement.query(By.css('.action-confirm'));
        expect(confirmBtnEl.nativeElement.textContent).toBe('Confirm');
    });

    it('should raise onSelectTime event when "Confirm" button clicked', () => {
        let selectedTimeValue: string;
        let initTimeMoment = moment().add(1, 'h');
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        comp.onSelectTime.subscribe(( time: string ) => selectedTimeValue = time);
        let confirmBtnEl = fixture.debugElement.query(By.css('.action-confirm'));
        confirmBtnEl.triggerEventHandler('click', null);
        expect(selectedTimeValue).toBe(initTimeMoment.format(comp.viewFormat));
    });

    it('should have a button named "Clear"', () => {
        let clearBtnEl = fixture.debugElement.query(By.css('.action-clear'));
        expect(clearBtnEl.nativeElement.textContent).toBe('Clear');
    });

    it('should raise onSelectTime event when "Clear" button clicked', () => {
        let selectedTimeValue: string;
        comp.onSelectTime.subscribe(( time: string ) => selectedTimeValue = time);
        let clearBtnEl = fixture.debugElement.query(By.css('.action-clear'));
        clearBtnEl.triggerEventHandler('click', null);
        expect(selectedTimeValue).toBeNull();
    });

    it('should have a button named "Close"', () => {
        let closeBtnEl = fixture.debugElement.query(By.css('.action-close'));
        expect(closeBtnEl.nativeElement.textContent).toBe('Close');
    });

    it('should raise onTimePickerCancel event when "Close" button clicked', () => {
        let timePickerStatus: boolean;
        comp.onTimePickerCancel.subscribe(( status: boolean ) => timePickerStatus = status);
        let closeBtnEl = fixture.debugElement.query(By.css('.action-close'));
        closeBtnEl.triggerEventHandler('click', null);
        expect(timePickerStatus).toBeFalsy();
    });

    it('should show second element as default', () => {
        fixture.detectChanges();
        let secondEl = fixture.debugElement.query(By.css('.second'));
        expect(secondEl).toBeTruthy();
    });

    it('should not show second element if showSecond variable set to be false', () => {
        comp.showSecond = false;
        fixture.detectChanges();
        let secondEl = fixture.debugElement.query(By.css('.second'));
        expect(secondEl).toBeFalsy();
    });

    it('should not show meridiem element as default', () => {
        fixture.detectChanges();
        let meridiemEl = fixture.debugElement.query(By.css('.meridiem'));
        expect(meridiemEl).toBeFalsy();
    });

    it('should show meridiem element if use12Hour variable set to be true', () => {
        comp.use12Hour = true;
        fixture.detectChanges();
        let meridiemEl = fixture.debugElement.query(By.css('.meridiem'));
        expect(meridiemEl).toBeTruthy();
    });

    it('should increase one hour if hour arrow up element was clicked', () => {
        let initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        let hourArrowUpEl = fixture.debugElement.query(By.css('.hour .arrow.up'));
        let hourEl = fixture.debugElement.query(By.css('.hour'));
        hourArrowUpEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(hourEl.nativeElement.textContent).toContain(initTimeMoment.add(1, 'h').format(comp.hourFormat));
    });

    it('should decrease one hour if hour arrow down element was clicked', () => {
        let initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        let hourArrowDownEl = fixture.debugElement.query(By.css('.hour .arrow.down'));
        let hourEl = fixture.debugElement.query(By.css('.hour'));
        hourArrowDownEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(hourEl.nativeElement.textContent).toContain(initTimeMoment.subtract(1, 'h').format(comp.hourFormat));
    });

    it('should increase one minute if minute arrow up element was clicked', () => {
        let initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        let minuteArrowUpEl = fixture.debugElement.query(By.css('.minute .arrow.up'));
        let minuteEl = fixture.debugElement.query(By.css('.minute'));
        minuteArrowUpEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(minuteEl.nativeElement.textContent).toContain(initTimeMoment.add(1, 'm').format('mm'));
    });

    it('should decrease one minute if minute arrow down element was clicked', () => {
        let initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        let minuteArrowDownEl = fixture.debugElement.query(By.css('.minute .arrow.down'));
        let minuteEl = fixture.debugElement.query(By.css('.minute'));
        minuteArrowDownEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(minuteEl.nativeElement.textContent).toContain(initTimeMoment.subtract(1, 'm').format('mm'));
    });

    it('should increase one second if second arrow up element was clicked', () => {
        let initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        let secondArrowUpEl = fixture.debugElement.query(By.css('.second .arrow.up'));
        let secondEl = fixture.debugElement.query(By.css('.second'));
        expect(secondEl.nativeElement.textContent).toContain('00');
        secondArrowUpEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(secondEl.nativeElement.textContent).toContain('01');
    });

    it('should decrease one second if second arrow down element was clicked', () => {
        let initTimeMoment = moment();
        comp.initTime = initTimeMoment.format(comp.viewFormat);
        comp.returnObject = 'string';
        fixture.detectChanges();
        let secondArrowDownEl = fixture.debugElement.query(By.css('.second .arrow.down'));
        let secondEl = fixture.debugElement.query(By.css('.second'));
        expect(secondEl.nativeElement.textContent).toContain('00');
        secondArrowDownEl.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(secondEl.nativeElement.textContent).toContain('59');
    });
});
