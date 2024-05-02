import { WorkDay } from "./WorkDay";

export class WorkMonth {
    private firstDayOfMonth: number = 1;
    private lastDateOfMonth: number;
    workDays: WorkDay[] = [];

    constructor(private internalDate: Date, workdays: WorkDay[]) {
        this.lastDateOfMonth = new Date(internalDate.getFullYear(), internalDate.getMonth() + 1, 0).getDate();

        let dayArray: WorkDay[] = [];
        workdays.forEach(day => {
            dayArray[day.dayOfMonth()] = day;
        });

        for(let dayNum = this.firstDayOfMonth; dayNum <= this.lastDateOfMonth; dayNum++) {
            this.workDays.push(dayArray[dayNum] ?? new WorkDay(new Date(internalDate.getFullYear(), internalDate.getMonth(), dayNum), []));
        }
    }

    static of(date: Date, workDays: WorkDay[]) {
        return new WorkMonth(date, workDays);
    }
}