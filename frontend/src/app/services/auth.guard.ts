import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const token = this.authService.getToken();
    console.log(`🚀 ~ token:`, token);

    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
