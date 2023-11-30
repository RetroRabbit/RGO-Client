import { Component, EventEmitter, Input, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  @Input() dialogType: { type: string, title: string, subtitle: string } = { type: '', title: '', subtitle: '' };
  @Output() confirmation = new EventEmitter<boolean>();

  @ViewChild('dialogSaveTemplate') dialogSaveTemplate!: TemplateRef<any>;
  buttonText: string = '';
  constructor(private dialog: MatDialog) { }

  ngAfterViewInit() {
    switch (this.dialogType.type) {
      case 'save': {
        this.buttonText= 'Save'
        break;
      }
      case 'discard': {
        this.buttonText= 'Discard'
        break;
      }
    }
    this.dialog.open(this.dialogSaveTemplate);
  }

  captureResponse(event: any) {
    this.confirmation.emit(event);
  }
}