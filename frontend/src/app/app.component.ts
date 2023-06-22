import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Observable, Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private primeConfig: PrimeNGConfig) {

  }
  ngOnInit(): void {
    this.primeConfig.ripple = true;
  }
}
