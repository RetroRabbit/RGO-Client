import { Component, EventEmitter, Input, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  @Input() dialogType: { type: string, title: string } = { type: '', title: '' };
  @Output() confirmmation = new EventEmitter<boolean>();

  @ViewChild('dialogSaveTemplate') dialogSaveTemplate!: TemplateRef<any>;
  @ViewChild('dialogCancelTemplate') dialogCancelTemplate!: TemplateRef<any>;

  constructor(private dialog: MatDialog) { }

  ngAfterViewInit() {
    switch (this.dialogType.type) {
      case 'save': {
        this.dialog.open(this.dialogSaveTemplate);
        break;
      }
      case 'discard': {
        this.dialog.open(this.dialogCancelTemplate);
        break;
      }
    }
  }

  captureResponse(event: any) {
    this.confirmmation.emit(event);
  }
}