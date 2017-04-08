/**
 * translate.service
 */

import { EventEmitter, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, Observer } from 'rxjs/Rx';
import "rxjs/add/observable/of";
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import { isDefined } from './util';
import { TranslateDefaultParser } from './translate.parser';

export interface LangChangeEvent {
    lang: string;
    translations: any;
}

@Injectable()
export class TranslateService {

    private slugs = {
        'en': 'en',
        'zh_CN': 'zh-cn',
        'zh_HK': 'zh-hk',
        'zh_TW': 'zh-tw',
    };
    private pending: boolean;
    private defaultLang: string;

    private onDefaultLangChange: EventEmitter<LangChangeEvent> = new EventEmitter<LangChangeEvent>();

    get OnDefaultLangChange(): EventEmitter<LangChangeEvent> {
        return this.onDefaultLangChange;
    }

    private onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter<LangChangeEvent>();

    get OnLangChange(): EventEmitter<LangChangeEvent> {
        return this.onLangChange;
    }

    /* Property currentLang */
    private currentLang: string;

    get CurrentLang(): string {
        return this.currentLang;
    }

    private translations: any = {};

    private translationRequests: any = {};
    private loadingTranslations: any = {};

    constructor( private http: Http,
                 private parser: TranslateDefaultParser ) {
    }

    public setDefaultLang( lang: string ): void {
        if (lang === this.defaultLang) {
            return;
        }

        let pending: Observable<any> = this.retrieveTranslations(lang);

        if (typeof pending !== 'undefined') {
            if (!this.defaultLang) {
                this.defaultLang = lang;
            }

            pending.take(1)
                .subscribe(( res: any ) => {
                    this.changeDefaultLang(lang);
                });
        } else {
            this.changeDefaultLang(lang);
        }
    }

    public use( lang: string ): void {
        let pending: Observable<any> = this.retrieveTranslations(lang);

        if (typeof pending !== 'undefined') {
            if (!this.currentLang) {
                this.currentLang = lang;
            }

            pending.take(1)
                .subscribe(( res: any ) => {
                    this.changeLang(lang)
                });
        } else {
            this.changeLang(lang);
        }
    }

    public instant( key: string ): string {
        return this.translate(key);
    }

    public get( key: any ) {
        if (!isDefined(key) || !key.length) {
            throw new Error(`Parameter "key" required`);
        }

        if (this.pending) {
            return Observable.create(( observer: Observer<string> ) => {
                let onComplete = ( res: string ) => {
                    observer.next(res);
                    observer.complete();
                };
                let onError = ( err: any ) => {
                    observer.error(err);
                };

                this.loadingTranslations.subscribe(( res: any ) => {
                    res = this.getParsedResult(res.json(), key);
                    if (typeof res.subscribe === "function") {
                        res.subscribe(onComplete, onError);
                    } else {
                        onComplete(res);
                    }
                }, onError);
            });
        } else {
            let res = this.getParsedResult(this.translations[this.currentLang], key);
            if (typeof res.subscribe === "function") {
                return res;
            } else {
                return Observable.of(res);
            }
        }
    }

    public getParsedResult( translations: any, key: string ): any {
        let res: string;
        if (translations) {
            res = this.parser.getValue(translations, key);
        }

        if (typeof res === 'undefined' && this.defaultLang &&
            this.defaultLang !== this.currentLang) {
            res = this.parser.getValue(this.translations[this.defaultLang], key);
        }

        return typeof res !== 'undefined' ? res : key;
    }

    private translate( key: string ): string {
        let translation = key;

        if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
            return this.translations[this.currentLang][key];
        }

        return translation;
    }

    private retrieveTranslations( lang: string ): Observable<any> {
        let pending: Observable<any>;

        if (typeof this.translationRequests[lang] === 'undefined') {
            this.translationRequests[lang] = this.translationRequests[lang] || this.getTranslation(lang);
            pending = this.translationRequests[lang];
        }

        return pending;
    }

    private getTranslation( lang: string ): Observable<any> {
        this.pending = true;

        let slug = this.slugs[lang] || this.slugs[this.defaultLang] || 'en';

        this.loadingTranslations = this.http.get('./assets/' + slug + '.json').share();

        this.loadingTranslations.take(1)
            .subscribe(( res: any ) => {
                this.translations[lang] = res.json();
                this.pending = false;
            }, ( error: any ) => {
                this.pending = false;
            });

        return this.loadingTranslations;
    }

    private changeDefaultLang( lang: string ): void {
        this.defaultLang = lang;
        this.OnDefaultLangChange.emit({lang: lang, translations: this.translations[lang]});
    }

    private changeLang( lang: string ): void {
        this.currentLang = lang;
        this.OnLangChange.emit({lang: lang, translations: this.translations[lang]});

        if (!this.defaultLang) {
            this.changeDefaultLang(lang);
        }
    }
}
