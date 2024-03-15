import { Component, EventEmitter, Input, Output, SimpleChanges, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  @Input() dialogType: Dialog = { type: '', title: '', subtitle: '', confirmButtonText: '', denyButtonText: '' };
  @Output() confirmation = new EventEmitter<boolean>();

  @ViewChild('dialogSaveTemplate') dialogSaveTemplate!: TemplateRef<any>;
  @ViewChild('dialogSaveTemplateMobile') dialogSaveTemplateMobile!: TemplateRef<any>;

  confirmButtonText: string = '';
  cancelButtonText: string = '';
  screenWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  constructor(private dialog: MatDialog, private navService: NavService) {
    navService.showNavbar = true;
  }
  ngOnInit() {
    this.onResize();
  }
  ngAfterViewInit() {
    if (this.screenWidth > 767) {
      this.dialog.open(this.dialogSaveTemplate);
    }
    else if (this.screenWidth <= 767) {
      this.dialog.open(this.dialogSaveTemplateMobile);
    }
  }

  captureResponse(event: any) {
    this.confirmation.emit(event);
  }
}