import { PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
export declare class TranslatePipe implements PipeTransform {
    private translate;
    constructor(translate: TranslateService);
    transform(value: string, args: any[]): any;
}
