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
        let errorMessage = 'Wystąpił nieznany błąd serwera.';
        if (error.error instanceof ErrorEvent) {
          // Błąd po stronie klienta lub sieci
          errorMessage = `Błąd: ${error.error.message}`;
        } else {
          // Błąd odpowiedzi serwera
          errorMessage = `Błąd serwera (status: ${error.status}): ${error.message}`;
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd API',
          detail: errorMessage,
          life: 5000,
        });
        console.error('HttpErrorInterceptor caught an API error:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
