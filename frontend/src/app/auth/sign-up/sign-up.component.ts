import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../auth.component.scss'],
  providers: [MessageService],
})
export class SignUpComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly cookieService: CookieService,
    private readonly titleSesrvice: Title
  ) {
    this.titleSesrvice.setTitle('To Do App | Sign Up');
  }

  ngOnInit(): void {
    console.log(this.stepIndex);
  }

  signUpForm = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    email: new FormControl('', [Validators.email, Validators.required]),
    code: new FormControl('', [Validators.required]),
    gender: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    password_email: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    confirmPassword: new FormControl('', Validators.required),
  });
  visibleEmail: boolean = false;
  loading: boolean = false;
  stepIndex: number = 0;
  isFocusStepEmail: boolean = false;
  isFocusStepCode: boolean = false;
  isFocusStepPassword: boolean = false;
  isShowProgressBar: boolean = false;
  blockedPanel: boolean = false;
  items: MenuItem[] = [
    {
      label: 'Verify Email',
    },
    {
      label: 'Confirm code',
    },
    {
      label: 'Password',
    },
  ];

  handleSignUp() {
    console.log(this.signUpForm.value);

    if (
      this.signUpForm.get('username')?.hasError('required') ||
      this.signUpForm.get('gender')?.hasError('required') ||
      this.signUpForm.get('password')?.hasError('required') ||
      this.signUpForm.get('confirmPassword')?.hasError('required')
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please fill all fields',
      });
      return;
    }
    if (this.signUpForm.get('username')?.hasError('minlength')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Username must have at least 6 characters',
      });
      return;
    }
    if (this.signUpForm.get('password')?.hasError('minlength')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Password must have at least 6 characters',
      });
      return;
    }
    if (
      this.signUpForm.value.password !== this.signUpForm.value.confirmPassword
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Confirm Password is not the same as password',
      });
      return;
    }

    this.authService
      .signUp({
        username: this.signUpForm.value.username!,
        password: this.signUpForm.value.password!,
        gender: this.signUpForm.value.gender!,
      })
      .subscribe(
        (data: any) => {
          this.cookieService.set(
            'todo_new_username',
            this.signUpForm.value.username!
          );
          this.cookieService.set('todo_new_email', '');
          this.messageService.add({
            severity: 'success',
            summary: data.message,
          });
          this.router.navigate(['/auth/login']);
        },
        (error) => {
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
