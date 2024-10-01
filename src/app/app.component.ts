import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title!: String;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getTitle().subscribe((appTitle) => (this.title = appTitle));
  }
}
