import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TerminatorService {

  constructor() { }

  shutdown() {
      (<any>window).electronAPI.shutdown();
  }
}
