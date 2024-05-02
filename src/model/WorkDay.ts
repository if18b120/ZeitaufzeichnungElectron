import { WorkShift } from "./WorkShift";

export class WorkDay {
    constructor(private internalDate: Date, private shifts: WorkShift[]) {}

    dayOfMonth(): number {
        return this.internalDate.getDate();
    }
}