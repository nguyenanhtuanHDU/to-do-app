import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly cookieService: CookieService
  ) {}

  apiUser = environment.apiBackend + 'users/';

  getUserSession(): Observable<User> {
    return this.http.get<User>(this.apiUser + 'user/session', {
      headers: this.authService.getHeaders(),
      withCredentials: true,
    });
  }
}
