/**
 * translate.service
 */

import { Inject, Injectable } from '@angular/core';
import { TRANSLATIONS } from './translations';

@Injectable()
export class TranslateService {

    /* Property currentLang */
    private currentLang: string;

    get CurrentLang(): string {
        return this.currentLang || this.defaultLang;
    }

    private defaultLang: string = 'en';

    private fallback: boolean = true;

    constructor( @Inject(TRANSLATIONS) private translations: any ) {
    }

    public use( lang: string ): void {
        this.currentLang = lang;
    }

    public instant( key: string ): string {
        return this.translate(key);
    }

    public setDefaultLang( lang: string ) {
        this.defaultLang = lang; // set default lang
    }

    public enableFallback( enable: boolean ) {
        this.fallback = enable; // enable or disable fallback language
    }

    private translate( key: string ): string {
        let translation = key;

        if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
            return this.translations[this.currentLang][key];
        }

        if (!this.fallback) {
            return translation;
        }

        if (this.translations[this.defaultLang] && this.translations[this.defaultLang][key]) {
            return this.translations[this.defaultLang][key];
        }

        return translation;
    }

}
