/**
 * translate.pipe
 */

import { ChangeDetectorRef, EventEmitter, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { equals } from './util';
import { LangChangeEvent, TranslateService } from './translate.service';

@Pipe({
    name: 'translate',
    pure: false,
})

export class TranslatePipe implements PipeTransform, OnDestroy {

    private value: string = '';
    private lastKey: string;
    private onDefaultLangChange: EventEmitter<LangChangeEvent>;
    private onLangChange: EventEmitter<LangChangeEvent>;

    constructor( private translate: TranslateService,
                 private ref: ChangeDetectorRef ) {
    }

    public ngOnDestroy(): void {
        this.dispose();
    }

    public transform( query: any, ...args: any[] ): any {
        if (!query || query.length === 0) {
            return query;
        }

        if (equals(query, this.lastKey)) {
            return this.value;
        }

        this.lastKey = query;

        this.updateValue(query);

        this.dispose();

        if (!this.onLangChange) {
            this.onLangChange = this.translate.OnLangChange.subscribe(( event: LangChangeEvent ) => {
                if (this.lastKey) {
                    this.lastKey = null;
                    this.updateValue(query, event.translations);
                }
            })
        }

        if (!this.onDefaultLangChange) {
            this.onDefaultLangChange = this.translate.OnDefaultLangChange.subscribe(() => {
                if (this.lastKey) {
                    this.lastKey = null;
                    this.updateValue(query);
                }
            });
        }

        return this.value;
    }

    private updateValue( key: any, translations?: any ) {

        let onTranslation = ( res: string ) => {
            this.value = res !== undefined ? res : key;
            this.lastKey = key;
            this.ref.markForCheck();
        };

        if (translations) {
            let res = this.translate.getParsedResult(translations, key);
            if (typeof res.subscribe === 'function') {
                res.subscribe(onTranslation);
            } else {
                onTranslation(res);
            }
        }

        this.translate.get(key)
            .subscribe(onTranslation);
    }

    private dispose(): void {
        if (typeof this.onLangChange !== 'undefined') {
            this.onLangChange.unsubscribe();
            this.onLangChange = undefined;
        }
        if (typeof this.onDefaultLangChange !== 'undefined') {
            this.onDefaultLangChange.unsubscribe();
            this.onDefaultLangChange = undefined;
        }
    }
}
