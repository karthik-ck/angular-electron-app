import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DecryptionService } from '../_services/decryption.service';

@Injectable()
export class DecryptionInterceptor implements HttpInterceptor {
  constructor(private decryptionService: DecryptionService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      switchMap(event => {
        if (event instanceof HttpResponse) {
          return this.decryptResponseData(event);
        }
        return of(event);
      })
    );
  }

  private decryptResponseData(response: HttpResponse<any>): Observable<HttpEvent<any>> {
    if (response.body && typeof response.body) {
      const decryptedData = this.decryptionService.decrypt(response.body, 'mysecretkey');
      response = response.clone({ body: decryptedData });
    }
    return of(response);
  }
}