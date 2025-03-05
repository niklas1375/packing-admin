import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { AppService } from './services/app.service';
import { AsyncPipe } from '@angular/common';
import { delay, Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatToolbar, AsyncPipe],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title$!: Observable<String>;

  constructor(private appService: AppService) {
    this.title$ = this.appService.getTitle().pipe(delay(0));
  }
}
