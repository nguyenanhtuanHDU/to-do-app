import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  users = [];

  constructor(private readonly authService: AuthService) {}

  refreshToken() {
    this.authService.getAllUsers().subscribe((data) => {
      console.log('data', data);
    });
  }
}
