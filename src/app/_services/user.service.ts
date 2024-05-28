import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(
        private router: Router,
        private http: HttpClient
    ) {}
}