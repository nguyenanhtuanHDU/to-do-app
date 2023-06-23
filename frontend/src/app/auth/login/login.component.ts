import { Component } from '@angular/core';
import {
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss'],
  providers: [MessageService],
})
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly cookieService: CookieService,
    private readonly router: Router,
    private readonly titleSesrvice: Title
  ) {
    this.titleSesrvice.setTitle('To Do App | Login');
  }

  ngOnInit(): void {
    console.log('cookie', this.cookieService.getAll());
    if (
      !this.cookieService.get('todo_new_email') &&
      !this.cookieService.get('todo_new_username')
    ) {
      console.log('username');
      this.isAutoFocusUsername = true;
    } else {
      console.log('password');
      this.isAutoFocusPassword = true;
    }
  }

  loginForm = new FormGroup({
    username: new FormControl(
      this.cookieService.get('todo_new_username') ||
        this.cookieService.get('todo_new_email'),
      Validators.minLength(6)
    ),
    password: new FormControl('', Validators.minLength(6)),
  });
  isAutoFocusUsername: boolean = false;
  isAutoFocusPassword: boolean = false;

  loading: boolean = false;

  handleLogin() {
    const username = this.loginForm.value.username!;
    const password = this.loginForm.value.password!;

    if (username === '' || password === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Username and Password can not be empty',
      });
      return;
    }

    if (username.length < 6 || password.length < 6) {
      this.messageService.add({
        severity: 'error',
        summary: 'Username and Password must be at least 6 characters',
      });
      return;
    }
    this.loading = true;
    this.authService
      .login({
        username,
        password,
      })
      .subscribe(
        (data: any) => {
          this.loading = false;
          console.log(`🚀 ~ data:`, data);
          this.authService.setToken(data.accessToken);
          this.cookieService.set('todo_new_username', '');
          this.authService.getHeaders();
          this.router.navigate(['']);
        },
        (error) => {
          this.loading = false;
          error.error.message = [error.error.message];
          error.error.message.map((msg: string) => {
            this.messageService.add({
              severity: 'error',
              summary: msg,
            });
          });
        }
      );
  }
}
