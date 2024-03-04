import { Component, EventEmitter, Input, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { NavService } from 'src/app/components/shared-components/nav-service/nav.service';
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  @Input() dialogType: Dialog = { type: '', title: '', subtitle: '', confirmButtonText: '', denyButtonText: '' };
  @Output() confirmation = new EventEmitter<boolean>();

  @ViewChild('dialogSaveTemplate') dialogSaveTemplate!: TemplateRef<any>;
  confirmButtonText: string = '';
  cancelButtonText: string = '';
  constructor(private dialog: MatDialog, private navService: NavService) {
    navService.showNavbar = true;
   }

  ngAfterViewInit() {
    this.dialog.open(this.dialogSaveTemplate);
  }

  captureResponse(event: any) {
    this.confirmation.emit(event);
  }
}