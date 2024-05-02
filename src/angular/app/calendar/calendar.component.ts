import { Component } from '@angular/core';
import { DateProviderService } from '../date-provider.service';
import { WorkMonth } from '../../../model/WorkMonth';

@Component({
    selector: 'calendar',
    standalone: true,
    imports: [],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

    constructor(private dateProviderService: DateProviderService) {}

    month: WorkMonth | undefined;

    load() {
        this.month = WorkMonth.of(this.dateProviderService.today(), []);
    }
}
