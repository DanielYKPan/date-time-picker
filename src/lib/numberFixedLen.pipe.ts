/**
 * numberFixedLen.pipe
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFixedLen'
})
export class NumberFixedLenPipe implements PipeTransform {
    transform( num: number, len: number ): string {
        num = Math.floor(num);
        len = Math.floor(len);

        if (isNaN(num) || isNaN(len)) {
            return num.toString();
        }

        let numString = num.toString();

        while (numString.length < len) {
            numString = '0' + numString;
        }

        return numString;
    }
}
