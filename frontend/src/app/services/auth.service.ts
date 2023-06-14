import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/auth';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiAuth: string = environment.apiBackend + 'auth/login';

  constructor(private readonly http: HttpClient) {}

  login(loginData: Login) {
    return this.http.post(this.apiAuth, loginData);
  }
}
