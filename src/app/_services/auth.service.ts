import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    login(username: any, password: any) {
        return this.http.post<any>(`${environment.apiUrl}${environment.apiPrefix}/admin/login`, { email: username, password: password })
            .pipe(map(user => {
                localStorage.setItem(`${environment.appName}` + 'user', user.data.access_token);
                return user;
            }));
    }

    logout() {
        localStorage.removeItem(`${environment.appName}` + 'user');
        this.router.navigate(['/login']);
    }
}