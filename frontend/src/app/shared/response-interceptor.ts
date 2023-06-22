// import { Injectable } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpErrorResponse,
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service';

// @Injectable()
// export class ResponseInterceptor implements HttpInterceptor {
//   constructor(private readonly authService: AuthService) {}

//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.log(`🚀 ~ error:`, error);

//         if (
//           error.status === 401 &&
//           error.error.message == 'Access token is expired'
//         ) {
//           console.log('access token het han');
//           this.authService.refreshToken().subscribe((data: any) => {
//             console.log('chuyen den refresh token', data);
//             this.authService.setToken(data.accessToken);
//             console.log('token moi: ', this.authService.getToken());
//           });
//         }
//         return throwError(error);
//       })
//     );
//   }
// }

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(`🚀 ~ error:`, error);

        if (
          error.status === 401 &&
          error.error.message == 'Access token is expired'
        ) {
          console.log('Access token đã hết hạn');

          return this.authService.refreshToken().pipe(
            switchMap((data: any) => {
              console.log('Chuyển đến refresh token', data);
              console.log('token cu: ', this.authService.getToken());

              this.authService.setToken(data.accessToken);

              console.log('Token mới: ', this.authService.getToken());
              const newAccessToken = this.authService.getToken();
              // Thay thế access token trong yêu cầu ban đầu
              const newRequest = request.clone({
                setHeaders: {
                  token: 'Bearer ' + newAccessToken,
                },
              });

              // Gửi lại yêu cầu ban đầu với access token mới
              return next.handle(newRequest);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
