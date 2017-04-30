/**
 * translate.service.spec
 */

import { TranslateService } from './translate.service';
import { TRANSLATIONS } from './translations';
import { TestBed } from '@angular/core/testing';

describe('TranslateService without the TestBed', () => {
    let service: TranslateService;

    let locale: string = 'zh_CN';

    it('should set the currentLang to locale', () => {
        service = new TranslateService(TRANSLATIONS);
        service.use(locale);
        expect(service.CurrentLang).toBe(locale);
    });

    it('should return the defaultLang if the currentLang is NOT set', () => {
        let defaultLang = 'en';
        service = new TranslateService(TRANSLATIONS);
        service.setDefaultLang(defaultLang);
        expect(service.CurrentLang).toBe(defaultLang);
    });
});

describe('TranslateService with the TestBed', () => {

    let service: TranslateService;

    let locale: string = 'zh_CN';

    const dictionary = {
        'en' : {
            'good': 'Good',
            'hello': 'Hello',
        },
        'zh_CN': {
            'good': '好'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{provide: TRANSLATIONS, useValue: dictionary}, TranslateService]
        });

        service = TestBed.get(TranslateService, null);
    });

    it('should return the defaultLang if the currentLang is NOT set', () => {
        let defaultLang = 'en';
        service.setDefaultLang(defaultLang);
        expect(service.CurrentLang).toBe(defaultLang);
    });

    it('should translate word to the current locale', () => {
        service.use(locale);
        expect(service.instant('good')).toBe('好');
    });

    it('should return default translated word if the key not found in current language', () => {
        let defaultLang = 'en';
        service.setDefaultLang(defaultLang);
        service.use(locale);
        expect(service.instant('hello')).toBe('Hello');
    });

    it('should return the key if the key not found in current language and fallback is disabled', () => {
        let defaultLang = 'en';
        service.setDefaultLang(defaultLang);
        service.use(locale);
        service.enableFallback(false);
        expect(service.instant('hello')).toBe('hello');
    });
});
