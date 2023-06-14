import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { UserCreate, UserLogin } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiAuth: string = environment.apiBackend + 'auth/';

  constructor(private readonly http: HttpClient) {}

  login(userLogin: UserLogin) {
    return this.http.post(this.apiAuth + 'login', userLogin);
  }

  signUp(user: UserCreate) {
    return this.http.post(this.apiAuth + 'sign-up', user);
  }
}
