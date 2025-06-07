import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private messageService: MessageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown server error occurred.';
        if (error.error instanceof ErrorEvent) {
          // Client-side or network error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server response error
          errorMessage = `Server error (status: ${error.status}): ${error.message}`;
        }
        this.messageService.add({
          severity: 'error',
          summary: 'API Error',
          detail: errorMessage,
          life: 5000,
        });
        console.error('HttpErrorInterceptor caught an API error:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
