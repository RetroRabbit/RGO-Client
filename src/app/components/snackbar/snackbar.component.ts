import { Component, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent {

  constructor(public snackBar: MatSnackBar) {}
  snackBarRef = inject(MatSnackBarRef);
  showSnackbar(message: string, status: string) {
    this.snackBar.open(message, "close", {duration: 3000, panelClass: status, verticalPosition: 'top', horizontalPosition: 'center'})
  }
}
