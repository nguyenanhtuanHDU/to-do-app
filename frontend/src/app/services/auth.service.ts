import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  login(userLogin: UserLogin) {
    return this.http.post(this.apiAuth + 'login', userLogin);
  }

  signUp(user: UserCreate) {
    return this.http.post(this.apiAuth + 'sign-up', user);
  }

  verifyEmail(email: string) {
    this.cookieService.set('email_sign_up', email);
    return this.http.post(this.apiAuth + 'sign-up/verify-email', { email });
  }

  verifyCode(code: string) {
    return this.http.post(this.apiAuth + 'sign-up/verify-code', {
      code,
      email: this.cookieService.get('email_sign_up'),
    });
  }

  signUpWithEmail(password: string) {
    return this.http.post(this.apiAuth + 'sign-up/email', {
      email: this.cookieService.get('email_sign_up'),
      password,
      abc: 'abc'
    });
  }
}
