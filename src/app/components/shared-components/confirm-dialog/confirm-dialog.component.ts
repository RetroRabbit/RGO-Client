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
  @Output() declineResponse = new EventEmitter<any>();

  @ViewChild('dialogSaveTemplate') dialogSaveTemplate!: TemplateRef<any>;
  @ViewChild('dialogSaveTemplateMobile') dialogSaveTemplateMobile!: TemplateRef<any>;
  @ViewChild('dialogDeclineTemplate') dialogDeclineTemplate!: TemplateRef<any>;
  @ViewChild('dialogDeclineTemplateMobile') dialogDeclineTemplateMobile!: TemplateRef<any>;

  confirmButtonText: string = '';
  cancelButtonText: string = '';
  declineReason: string = "";
  selectedReason: number = -1;

  screenWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  constructor(private dialog: MatDialog, private navService: NavService) {
  }
  
  ngOnInit() {
    this.onResize();
  }
  
  ngAfterViewInit() {
    if (this.screenWidth > 767) {
      if(this.dialogType.type.toLocaleLowerCase() == 'decline')
        this.dialog.open(this.dialogDeclineTemplate);
      else
        this.dialog.open(this.dialogSaveTemplate);
    }
    else {
      if(this.dialogType.type.toLocaleLowerCase() == 'decline')
        this.dialog.open(this.dialogDeclineTemplateMobile);
      else
        this.dialog.open(this.dialogSaveTemplateMobile);
    }
  }

  captureResponse(event: any) {
    if(this.dialogType.type == 'decline')
      this.declineResponse.emit({
        confirmation: event,
        declineReason: this.declineReason,
        selectedReason: this.selectedReason
      });
    else
      this.confirmation.emit(event);
  }

  get hasDeclineReason():boolean {
    return this.declineReason != "";
  }

  get hasSelectedReason():boolean {
    return this.selectedReason != -1;
  }
}