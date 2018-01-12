import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public startAt = new Date(2019, 2, 15, 20, 30);

    public selectedMoment = new Date();
    public selectedMoment2 = new FormControl(new Date());
    public selectedMoments = [new Date(2018, 1, 12, 10, 30), new Date(2018, 3, 21, 20, 30)];

    public invalidMoment =  new Date(2018, 1, 11, 9, 30);
    public min = new Date(2018, 1, 12, 10, 30);
    public max = new Date(2018, 3, 21, 20, 30);

    public myFilter = (d: Date): boolean => {
        const day = d.getDay();
        // Prevent Saturday and Sunday from being selected.
        return day !== 0 && day !== 6;
    }
}
