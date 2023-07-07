import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { UserCreate, UserLogin } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiAuth: string = environment.apiBackend + 'auth/';

  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService
  ) {}

  refreshToken() {
    return this.http.get(this.apiAuth + 'refresh', {
      withCredentials: true, // để get cookie
    });
  }

  getAllUsers() {
    return this.http.get(environment.apiBackend + 'users', {
      headers: this.getHeaders(),
    });
  }

  login(userLogin: UserLogin) {

    return this.http.post(this.apiAuth + 'login', userLogin, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }

  logOut() {
    this.cookieService.deleteAll();
    return this.http.get(this.apiAuth + 'logout', {
      withCredentials: true,
    });
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  setToken(token: string) {
    this.cookieService.set('token', token);
  }

  getHeaders() {
    const headers = new HttpHeaders({
      token: `Bearer ${this.getToken()}`,
    });
    return headers;
  }

  signUp(user: UserCreate) {
    return this.http.post(this.apiAuth + 'sign-up', user);
  }
}
