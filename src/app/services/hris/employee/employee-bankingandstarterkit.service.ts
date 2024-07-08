import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BankingAndStarterKitDto } from 'src/app/models/hris/banking-and-starterkit.interface';
import { EmployeeBanking } from 'src/app/models/hris/employee-banking.interface';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { NotificationService } from '../notification.service';
import { DOCUMENTS_UPLOADED, EmployeeDocumentsStatus } from 'src/app/models/hris/constants/enums/employeeDocumentsStatus';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeBankingandstarterkitService {
  bankingAndStarterKitData$ = new BehaviorSubject<BankingAndStarterKitDto[]>([]);
  approvedCount$ = new BehaviorSubject<number>(0);
  pendingCount$ = new BehaviorSubject<number>(0);
  declinedCount$ = new BehaviorSubject<number>(0);
  baseUrl: string;

  constructor(private httpClient: HttpClient, 
    public toast: NotificationService,
    private snackBarService: SnackbarService) {
    this.baseUrl = environment.HttpsBaseURL;
  }

  getAllBankingAndStarterkits() {
  this.httpClient
    .get<BankingAndStarterKitDto[]>(`${this.baseUrl}/banking-starterkits`)
    .subscribe({
      next: (data: any[]) => {
        this.bankingAndStarterKitData$.next(data);
        this.getStatusCounts(data);
      },
      error: (er) => this.snackBarService.showError(er),
    });
  }

  getStatusCounts(dtos: BankingAndStarterKitDto[]) {
    let approvedCount = 0;
    let pendingCount = 0;
    let declinedCount = 0;

    const bankingDtos: EmployeeBanking[] = dtos
      .map((dto) => dto.employeeBankingDto)
      .filter(Boolean);

    const documentDtos: EmployeeDocument[] = dtos
      .map((dto) => dto.employeeDocumentDto)
      .filter(Boolean);

    approvedCount = bankingDtos.filter((dto) => dto.status == EmployeeDocumentsStatus.APPROVED).length;
    pendingCount = bankingDtos.filter((dto) => dto.status == EmployeeDocumentsStatus.PENDING).length;
    declinedCount = bankingDtos.filter((dto) => dto.status == EmployeeDocumentsStatus.DECLINED).length;

    let employeeIds = [...new Set(documentDtos.map((dto) => dto.employeeId))];

    employeeIds.forEach((id) => {
      let employeeDocuments = documentDtos.filter((dto) => dto.employeeId == id);
      if (employeeDocuments.length < DOCUMENTS_UPLOADED.MIN_STARTERKIT) {
        pendingCount++;
      } else if (employeeDocuments.every((document) => document.status == EmployeeDocumentsStatus.APPROVED)) {
        approvedCount++;
      } else if (employeeDocuments.every((document) => document.status == EmployeeDocumentsStatus.DECLINED)) {
        declinedCount++;
      } else {
        pendingCount++;
      }
    });

    this.approvedCount$.next(approvedCount);
    this.pendingCount$.next(pendingCount);
    this.declinedCount$.next(declinedCount);
  }

  incrementPendingCount(){
    this.pendingCount$.next(this.pendingCount$.value + 1);
  } 
  
  decrementPendingCount(){
    this.pendingCount$.next(this.pendingCount$.value - 1);
  }
}
