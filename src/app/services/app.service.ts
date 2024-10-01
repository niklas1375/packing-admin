import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private title = new BehaviorSubject<String>('Packlisten verwalten');
  private title$ = this.title.asObservable();

  constructor() {}

  setTitle(title: String) {
    this.title.next(title);
  }

  getTitle() {
    return this.title$;
  }
}
