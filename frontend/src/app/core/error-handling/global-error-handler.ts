import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private messageService: MessageService,
    private ngZone: NgZone
  ) {}

  handleError(error: any): void {
    this.ngZone.run(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Wystąpił nieoczekiwany błąd',
        detail: 'Skontaktuj się z administratorem lub spróbuj ponownie później.',
        life: 5000,
      });
    });
    console.error('GlobalErrorHandler caught an error:', error);
    // TODO: W przyszłości można dodać integrację z serwisem logowania błędów po stronie serwera
  }
}
