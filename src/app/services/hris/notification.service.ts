import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastService: NgToastService) { }

  showToast(message: string, type: 'success' | 'error', duration: number = 5000): void {
    if (type === 'success') {
      this.toastService.success({
        detail: 'SUCCESS',
        summary: message,
        duration: duration
      })
    }
    if (type === 'error') {
      this.toastService.error({
        detail: 'ERROR',
        summary: message,
        duration: duration
      })
    }
  }
}
