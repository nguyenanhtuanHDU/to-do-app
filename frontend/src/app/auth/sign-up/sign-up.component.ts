import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../auth.component.scss'],
  providers: [MessageService],
})
export class SignUpComponent {
  signUpForm = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    gender: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    confirmPassword: new FormControl('', Validators.required),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly cookieService: CookieService
  ) {}

  loading: boolean = false;

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

    this.cookieService.set(
      'todo_new_username',
      this.signUpForm.value.username!
    );

    this.authService
      .signUp({
        username: this.signUpForm.value.username!,
        password: this.signUpForm.value.password!,
        gender: this.signUpForm.value.gender!,
      })
      .subscribe(
        (data: any) => {
          console.log(`🚀 ~ data:`, data);
          this.messageService.add({
            severity: 'success',
            summary: data.message,
          });
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          console.log(`🚀 ~ error:`, error);
          error.error.message = [error.error.message];
          error.error.message.map((msg: string) => {
            this.messageService.add({
              severity: 'error',
              summary: msg,
              detail: error.statusText,
            });
          });
        }
      );
  }
}
