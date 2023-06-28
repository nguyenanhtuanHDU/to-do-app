import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { WeatherService } from '../services/weather.service';
import { SwiperComponent } from 'swiper/angular';
import {
  faAngleLeft,
  faAngleRight,
  faBell,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild(SwiperComponent) swiper!: SwiperComponent;

  constructor(
    private readonly titleSesrvice: Title,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly weatherService: WeatherService,
    private readonly cookieService: CookieService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {
    this.titleSesrvice.setTitle('To Do App | Home');
  }

  ngOnInit(): void {
    console.log('cookie', this.cookieService.getAll());
    console.log('auth: ', this.authService.getToken());

    this.userAvatar = this.cookieService.get('userAvatar');
    this.userService.getUserSession().subscribe((data) => {
      console.log(`🚀 ~ data:`, data);
      this.user = data;
    });

    if (this.weatherService.getIsAgreeLocation() === '') {
      this.weatherService.setIsAgreeLocation(false);
    }
    const isAgreeLocation = JSON.parse(
      this.weatherService.getIsAgreeLocation()
    );
    if (!isAgreeLocation) {
      this.confirmGetLocation();
      this.weatherService.setIsAgreeLocation(true);
    }
    if (isAgreeLocation) {
      this.getLocation();
    }
  }

  user!: User;
  userAvatar: string = '';

  swipePrev() {
    this.swiper.swiperRef.slidePrev();
  }
  swipeNext() {
    this.swiper.swiperRef.slideNext();
  }

  createChart() {
    this.chart = new Chart('MyChart', {
      type: 'line',
      data: {
        labels: this.listDaysChart,
        datasets: [
          {
            label: 'Max temperature',
            data: this.listMaxTempChart,
            backgroundColor: '#5946d2',
            borderColor: '#5946d2',
            pointBorderColor: '#fff',
            pointBackgroundColor: '#5946d2',
          },
          {
            label: 'Min temperature',
            data: this.listMinTempChart,
            backgroundColor: '#009aff',
            borderColor: '#009aff',
          },
        ],
      },
      options: {
        aspectRatio: 3.5,
        responsive: true, // Cho phép đáp ứng
        maintainAspectRatio: false, // Loại bỏ tỷ lệ khung cố định
      },
    });
  }

  public chart: any;

  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faMagnifyingGlass = faMagnifyingGlass;
  faBell = faBell;

  sidebarVisible: boolean = false;
  weather: any;
  listDaysChart: string[] = [];
  listMaxTempChart: string[] = [];
  listMinTempChart: string[] = [];

  confirmGetLocation() {
    this.confirmationService.confirm({
      message: 'Please allow location to get weather?',
      accept: () => {
        this.getLocation();
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.getWeather(lat, lon);
        this.getWeatherNextWeek(lat, lon);
      });
    } else {
      console.log('Trình duyệt không hỗ trợ Geolocation');
    }
  }

  getWeather(lat: number, lon: number) {
    this.weatherService.getWeather(lat, lon).subscribe(
      (data: any) => {
        // console.log('data', data);
        this.weather = data;
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'API Weather is error, please reload page',
        });
      }
    );
  }

  getWeatherNextWeek(lat: number, lon: number) {
    this.weatherService.getWeatherNextWeek(lat, lon).subscribe(
      (data: any) => {
        console.log(`🚀 ~ data:`, data);
        data.forecast.forecastday.map((item: any) => {
          this.listDaysChart.push(item.date);
          this.listMaxTempChart.push(item.day.maxtemp_c);

          this.listMinTempChart.push(item.day.mintemp_c);
        });
        console.log(`🚀 ~ this.listDaysChart:`, this.listDaysChart);
        console.log(`🚀 ~ this.listMaxTempChart:`, this.listMaxTempChart);
        console.log(`🚀 ~ this.listMinTempChart:`, this.listMinTempChart);
        this.createChart();
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'API Weather is error, please reload page',
        });
      }
    );
  }
}
