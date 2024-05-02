import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateProviderService {

  constructor() { }

  today(): Date {
    return new Date();
  }
}
