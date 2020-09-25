import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NumberValidatorDirective } from './number-validator.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlTimerBoxComponent } from './timer-box.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
export class MockElementRef extends ElementRef {}

fdescribe('PhoneNumberValidatorDirective', () => {
    let fixture: ComponentFixture<OwlTimerBoxComponent>;
    let testComponent: OwlTimerBoxComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                NumberValidatorDirective,
                ReactiveFormsModule,
            ],
            declarations: [NumberValidatorDirective, OwlTimerBoxComponent],
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [OwlTimerBoxComponent],
            },
        }).compileComponents();

        fixture = TestBed.createComponent(OwlTimerBoxComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
    }));

    fit('should set zeros', () => {
        const compiled = fixture.debugElement.nativeElement;
        const input = compiled.querySelector('input');
        testComponent.maxNumber = 23;
        testComponent.inputField = '55';
        fixture.detectChanges();
        expect(input.value).toEqual('00');
    });

    fit('should remove invalid character', () => {
        const compiled = fixture.debugElement.nativeElement;
        const input = compiled.querySelector('input');
        testComponent.maxNumber = 23;
        testComponent.inputField = '2b';
        fixture.detectChanges();
        expect(input.value).toEqual('2');
    });
});
