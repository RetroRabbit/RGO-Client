import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(public snackBar: MatSnackBar) { }

  showSnackbar(message: string, status: string) {
    this.snackBar.open(message, '✖', { duration: 3000, panelClass: status, verticalPosition: 'top', horizontalPosition: 'center' })
  }

  showError(error: any) {
    let message: string = "";
    if (typeof (error) === 'string') {
      message = error;
    }
    else if (error.error != null) {
      message = error.error;
    } 
    else if (error.statusText != null) {
      message = error.statusText;
    } else {
      message = "Application Error. Please try again later.";
    }
    this.snackBar.open(message, '✖', { duration: 4000, panelClass: 'snack-error', verticalPosition: 'top', horizontalPosition: 'center' })
  }
}
