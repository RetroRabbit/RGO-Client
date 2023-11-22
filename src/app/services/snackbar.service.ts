import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(public snackBar: MatSnackBar) {}

  showSnackbar(message: string, status: string) {
    this.snackBar.open(message, "", {duration: 3000, panelClass: status, verticalPosition: 'top', horizontalPosition: 'center'})
  }
}
