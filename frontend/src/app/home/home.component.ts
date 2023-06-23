import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private readonly titleSesrvice: Title) {
    this.titleSesrvice.setTitle('To Do App | Home');
  }
  sidebarVisible: boolean = false;
}
