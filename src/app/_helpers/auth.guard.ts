import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem(`${environment.appName}` + 'user')) {
            return true;
            
        } else {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            localStorage.setItem(`${environment.appName}` + 'user', '')
            return false;
        }
    }
}