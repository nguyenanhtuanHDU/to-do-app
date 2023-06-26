import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(
    private readonly cookieService: CookieService,
    private readonly authService: AuthService,
    private readonly http: HttpClient
  ) {}

  apiWeather = environment.apiWeather;

  getIsAgreeLocation(): string {
    return this.cookieService.get('is_location');
  }

  setIsAgreeLocation(agree: boolean) {
    this.cookieService.set('is_location', JSON.stringify(agree));
  }

  getWeather(lat: number, lon: number) {
    return this.http.get(this.apiWeather + lat + ',' + lon, {
      headers: this.authService.getHeaders(),
    });
  }

  getWeatherNextWeek(lat: number, lon: number, days: number = 7) {
    return this.http.get(this.apiWeather + lat + ',' + lon + '&days=' + days, {
      headers: this.authService.getHeaders(),
    });
  }
}
