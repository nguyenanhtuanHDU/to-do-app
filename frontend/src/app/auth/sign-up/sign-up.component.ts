import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    private readonly cookieService: CookieService
  ) {}

  ngOnInit(): void {
    console.log(this.index);
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
  index: number = 0;
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

  openDialogSignUpEmail() {
    this.visibleEmail = true;
  }

  handleSteps(event: number) {
    console.log(`🚀 ~ event:`, event);
    this.index = event;
  }

  verifyEmail() {
    if (this.signUpForm.get('email')?.hasError('email')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Email invalidate',
      });
      return;
    }
    this.authService.verifyEmail(this.signUpForm.value.email!).subscribe(
      (data: any) => {
        this.index = 1;
        this.messageService.add({
          severity: 'success',
          summary: data.message,
        });
      },
      (error) => {
        console.log(`🚀 ~ error:`, error);
        this.messageService.add({
          severity: 'error',
          summary: error.error.message,
          detail: error.statusText,
        });
      }
    );
  }

  verifyCode() {
    const code = this.signUpForm.value.code;
    console.log(`🚀 ~ code:`, code);
    if (code?.toString().length !== 4) {
      this.messageService.add({
        severity: 'error',
        summary: 'The length of must be 4 characters',
      });
      return;
    }
    this.authService.verifyCode(code).subscribe(
      (data: any) => {
        this.index = 2;
        this.messageService.add({
          severity: 'success',
          summary: data.message,
        });
      },
      (error) => {
        console.log(`🚀 ~ error:`, error);
        this.messageService.add({
          severity: 'error',
          summary: error.error.message,
          detail: error.statusText,
        });
      }
    );
  }
  signUpWithEmail() {
    if (this.signUpForm.get('password_email')?.hasError('minlength')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Password must have at least 6 characters',
      });
      return;
    }

    this.authService
      .signUpWithEmail(this.signUpForm.value.password_email!)
      .subscribe(
        (data: any) => {
          this.visibleEmail = false;
          this.cookieService.set(
            'todo_new_email',
            this.signUpForm.value.email!
          );
          this.messageService.add({
            severity: 'success',
            summary: data.message,
          });
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: error.error.message,
            detail: error.statusText,
          });
        }
      );
  }
}
