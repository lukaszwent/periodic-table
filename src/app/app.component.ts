import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
