import { Component } from '@angular/core';
import { EmployeeBanking } from 'src/app/models/employee-banking.interface';
import { EmployeeBankingService } from 'src/app/services/employee/employee-banking.service';

@Component({
  selector: 'app-pending-bank-statements',
  templateUrl: './pending-bank-statements.component.html',
  styleUrls: ['./pending-bank-statements.component.css']
})
export class PendingBankStatementsComponent {
  
  pendingBankStatements : EmployeeBanking[] = [];

  constructor(private employeeBankingService : EmployeeBankingService){  }

  ngOnInit() {
    this.employeeBankingService.getPending().subscribe( dataArray =>{
      this.pendingBankStatements = dataArray;
    })
  }
}
