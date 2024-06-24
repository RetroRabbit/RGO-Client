import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BankingAndStarterKitDto } from 'src/app/models/hris/banking-and-starterkit.interface';
import { EmployeeBanking } from 'src/app/models/hris/employee-banking.interface';
import { EmployeeDocument } from 'src/app/models/hris/employeeDocument.interface';
import { NotificationService } from '../notification.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeBankingandstarterkitService {
  readonly APPROVED_STATUS = 0;
  readonly PENDING_STATUS = 1;
  readonly DECLINED_STATUS = 2;
  readonly MIN_STARTERKIT_DOCUMENTS_UPLOADED = 3;

  bankingAndStarterKitData$ = new BehaviorSubject<BankingAndStarterKitDto[]>([]);
  approvedCount$ = new BehaviorSubject<number>(0);
  pendingCount$ = new BehaviorSubject<number>(0);
  declinedCount$ = new BehaviorSubject<number>(0);
  baseUrl: string;

  constructor(private httpClient: HttpClient, public toast: NotificationService) {
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
      error: (error: any) => {
        this.toast.showToast('Error fetching banking and starter kits',error.message, 5000);
      }
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

    approvedCount = bankingDtos.filter((dto) => dto.status == this.APPROVED_STATUS).length;
    pendingCount = bankingDtos.filter((dto) => dto.status == this.PENDING_STATUS).length;
    declinedCount = bankingDtos.filter((dto) => dto.status == this.DECLINED_STATUS).length;

    let employeeIds = [...new Set(documentDtos.map((dto) => dto.employeeId))];

    employeeIds.forEach((id) => {
      let employeeDocuments = documentDtos.filter((dto) => dto.employeeId == id);
      if (employeeDocuments.length < this.MIN_STARTERKIT_DOCUMENTS_UPLOADED) {
        pendingCount++;
      } else if (employeeDocuments.every((document) => document.status == this.APPROVED_STATUS)) {
        approvedCount++;
      } else if (employeeDocuments.every((document) => document.status == this.DECLINED_STATUS)) {
        declinedCount++;
      } else {
        pendingCount++;
      }
    });

    this.approvedCount$.next(approvedCount);
    this.pendingCount$.next(pendingCount);
    this.declinedCount$.next(declinedCount);
  }
}
