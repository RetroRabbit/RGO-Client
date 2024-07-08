import { Component, EventEmitter, HostListener, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Candidate } from 'src/app/models/ats/candidate.interface';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { CandidateService } from 'src/app/services/ats/candidate/candidate.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';

@Component({
  selector: 'app-ats-dashboard',
  templateUrl: './ats-dashboard.component.html',
  styleUrls: [ './ats-dashboard.component.css' ]
})

export class AtsDashboardComponent {
  isLoading: boolean = true;
  isMobileScreen = false;
  allCandidates: Candidate[] = [];
  displayedColumns: string[] = ['Name', 'Surname', 'Email', 'Role'];
  dataSource: MatTableDataSource<Candidate> = new MatTableDataSource();

  constructor(
    private router: Router,
    navService: NavService,
    public authAccessService: AuthAccessService,
    private candidateService: CandidateService,
    private snackBarService: SnackbarService) {
  }

  screenWidth = window.innerWidth;
  @HostListener('window:resize', [ '$event' ])
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
    this.screenWidth = window.innerWidth;
  }

  getAllCandidates() {
    this.candidateService.getAll().subscribe({
      next: data => {
        this.allCandidates = data;
        this.dataSource = new MatTableDataSource(this.allCandidates);
        this.dataSource.data = this.allCandidates;
        this.dataSource._updateChangeSubscription();
      },
      error: (er) => this.snackBarService.showError(er),
    })
  }

  ngOnInit() {
    this.getAllCandidates();
  }

  getCandidateRole(jobPosition: number): string {
    switch (jobPosition) {
      case 0:
        return "UI/UX Designer";
      case 1:
        return "Developer";
      case 2:
        return "Business Support";
      case 3:
        return "Scrum Master";
      default:
        return "No applicable role"
    }
  }

  AddCandidate() {
    this.router.navigateByUrl('/create-candidate');
  }
}
