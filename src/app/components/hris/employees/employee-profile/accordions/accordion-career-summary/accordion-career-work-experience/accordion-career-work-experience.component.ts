import { Component, HostListener, Input } from '@angular/core';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';
import { WorkExperience } from 'src/app/models/hris/work-experience.interface';
import { WorkExperienceService } from 'src/app/services/hris/employee/employee-work-experience.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { ROLES } from 'src/app/models/hris/constants/employee-skills-software-onType.constants';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-accordion-career-work-experience',
  templateUrl: './accordion-career-work-experience.component.html',
  styleUrls: ['./accordion-career-work-experience.component.css'],
  providers: [DatePipe],
})
export class AccordionCareerWorkExperienceComponent {
  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  panelOpenState: boolean = false;
  @Input() WorkExperience!: {
    [x: string]: any;
    workExperience: WorkExperience;
  };
  @Input() employeeProfile!: EmployeeProfile | SimpleEmployee;

  editWorkExperience: boolean = false;
  hasWorkExperienceData: boolean = false;
  isUpdated: boolean = false;
  hasUpdatedWorkExperience: boolean = false;
  addingWorkExperience: boolean = false;
  showConfirmDialog: boolean = false;

  removeNewOrUpdate: string = '';
  role: string = '';

  removeIndex: number = 0;
  workExperiences: WorkExperience[] = [];
  copyOfWorkExperience: WorkExperience[] = [];

  skillSetList: string[] = [];
  softwareList: string[] = [];

  dialogTypeData: Dialog = {
    type: 'confirm',
    title: 'Delete Experience',
    subtitle: 'Are you sure you want to delete?',
    confirmButtonText: 'Delete',
    denyButtonText: 'Cancel',
  };

  isDisabled: boolean = true;

  constructor(
    private workExperienceService: WorkExperienceService,
    private snackBarService: SnackbarService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getEmployeeType();
    this.getWorkExperience();
  }

  formatDate(date: string | Date): string {
    return this.datePipe.transform(date, 'dd MMMM yyyy')!;
  }

  getWorkExperience() {
    this.workExperienceService
      .getWorkExperience(this.employeeProfile.id as number)
      .subscribe({
        next: (data) => {
          this.sharedAccordionFunctionality.workExperience = data;
        },
        error: (er) => this.snackBarService.showError(er),
      });
  }

  getEmployeeType() {
    this.role = this.employeeProfile?.employeeType?.name as string;
    this.updateListsBasedOnRole();
  }

  updateListsBasedOnRole() {
    switch (this.role) {
      case 'Developer':
        this.skillSetList = ROLES.Developer.skillSetList;
        this.softwareList = ROLES.Developer.softwareList;
        break;
      case 'Designer':
        this.skillSetList = ROLES.Designer.skillSetList;
        this.softwareList = ROLES.Designer.softwareList;
        break;
      case 'Scrum Master':
        this.skillSetList = ROLES.ScrumMaster.skillSetList;
        this.softwareList = ROLES.ScrumMaster.softwareList;
        break;
      case 'Business Support':
        this.skillSetList = ROLES.BusinessSupport.skillSetList;
        this.softwareList = ROLES.BusinessSupport.softwareList;
        break;
      case 'Account Manager':
        this.skillSetList = ROLES.AccountManager.skillSetList;
        this.softwareList = ROLES.AccountManager.softwareList;
        break;
      case 'People Champion':
        this.skillSetList = ROLES.PeopleChampion.skillSetList;
        this.softwareList = ROLES.PeopleChampion.softwareList;
        break;
      case 'Executive':
        this.skillSetList = ROLES.Executive.skillSetList;
        this.softwareList = ROLES.Executive.softwareList;
        break;
      default:
        this.skillSetList = ['No skill set available for this employee type'];
        this.softwareList = ['No software is available for this employee type'];
        break;
    }
  }

  removeSkills(index: number, skill: string) {
    const skillSet = this.copyOfWorkExperience[index].skillSet;
    const skillIndex = skillSet!.indexOf(skill);
    if (skillIndex >= 0) {
      skillSet!.splice(skillIndex, 1);
      this.copyOfWorkExperience[index].skillSet = [...skillSet!];
    }
  }

  removeNewSkills(index: number, skill: string) {
    const newSkillSet = this.sharedAccordionFunctionality.newWorkExperiences[index].skillSet
    const newskillIndex = newSkillSet!.indexOf(skill);
    if (newskillIndex >= 0) {
      newSkillSet!.splice(newskillIndex, 1);
      this.sharedAccordionFunctionality.newWorkExperiences[index].skillSet = [...newSkillSet!];
    }
  }

  removeSoftware(index: number, software: string) {
    const softwareItems = this.copyOfWorkExperience[index].software;
    const softwareIndex = softwareItems!.indexOf(software);
    if (softwareIndex >= 0) {
      softwareItems!.splice(softwareIndex, 1);
      this.copyOfWorkExperience[index].software = [...softwareItems!];
    }
  }

  removeNewSoftware(index: number, software: string) {
    const newSoftwareItems = this.sharedAccordionFunctionality.newWorkExperiences[index].software
    const newsoftwareIndex = newSoftwareItems!.indexOf(software);
    if (newsoftwareIndex >= 0) {
      newSoftwareItems!.splice(newsoftwareIndex, 1);
      this.sharedAccordionFunctionality.newWorkExperiences[index].software = [...newSoftwareItems!];
    }
  }

  addNewWorkExperience() {
    this.addingWorkExperience = true;
    const newWorkExperience: WorkExperience = {
      id: 0,
      clientName: '',
      projectName: '',
      skillSet: [],
      software: [],
      startDate: new Date(),
      endDate: new Date(),
      projectDescription: '',
      employeeId: this.employeeProfile.id as number,
    };
    this.sharedAccordionFunctionality.newWorkExperiences.push(
      newWorkExperience
    );
  }

  findDifferenceInArrays(): WorkExperience[] {
    let differenceArray: WorkExperience[] = [];

    for (
      let i = 0;
      i < this.sharedAccordionFunctionality.workExperience.length;
      i++
    ) {
      if (
        this.sharedAccordionFunctionality.workExperience[i].clientName !=
        this.copyOfWorkExperience[i].clientName
      )
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (
        this.sharedAccordionFunctionality.workExperience[i].projectName !=
        this.copyOfWorkExperience[i].projectName
      )
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (
        this.sharedAccordionFunctionality.workExperience[i].skillSet !=
        this.copyOfWorkExperience[i].skillSet
      )
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (
        this.sharedAccordionFunctionality.workExperience[i].software !=
        this.copyOfWorkExperience[i].software
      )
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (
        this.sharedAccordionFunctionality.workExperience[i].startDate !=
        this.copyOfWorkExperience[i].startDate
      )
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (
        this.sharedAccordionFunctionality.workExperience[i].endDate !=
        this.copyOfWorkExperience[i].endDate
      )
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (
        this.sharedAccordionFunctionality.workExperience[i]
          .projectDescription != this.copyOfWorkExperience[i].projectDescription
      )
        differenceArray.push(this.copyOfWorkExperience[i]);
    }
    return differenceArray;
  }

  editWorkExperiences() {
    this.editWorkExperience = true;
    this.copyOfWorkExperience = [];
    this.copyWorkExperiences();
  }

  copyWorkExperiences() {
    this.sharedAccordionFunctionality.workExperience.forEach(
      (workExperience) => {
        const copiedExperience = JSON.parse(JSON.stringify(workExperience));
        this.copyOfWorkExperience.push(copiedExperience);
      }
    );
  }

  cancelWorkExperience() {
    this.editWorkExperience = false;
    this.addingWorkExperience = false;
    this.sharedAccordionFunctionality.newWorkExperiences = [];
  }

  showDialog(newOrUpdate: string, index: number) {
    this.removeNewOrUpdate = newOrUpdate;
    this.removeIndex = index;
    this.showConfirmDialog = true;
  }

  dialogFeedBack(confirmation: boolean) {
    this.showConfirmDialog = false;
    if (confirmation) {
      if (this.removeNewOrUpdate == 'update') {
        this.removeExistingWorkExperience(this.removeIndex);
      } else {
        this.removenewWorkExperience(this.removeIndex);
      }
    }
  }

  removenewWorkExperience(index: number) {
    this.sharedAccordionFunctionality.newWorkExperiences.splice(index, 1);
  }

  removeExistingWorkExperience(index: number) {
    const deleteId = this.copyOfWorkExperience[index].id;
    this.workExperienceService.deleteWorkExperience(deleteId).subscribe({
      next: () => {
        this.snackBarService.showSnackbar('Updated', 'snack-success');
        this.copyOfWorkExperience.splice(index, 1);
        this.sharedAccordionFunctionality.workExperience.splice(index, 1);
        this.sharedAccordionFunctionality.workExperienceFormFields =
          this.sharedAccordionFunctionality.workExperienceFormFields - 7;
        this.editWorkExperience = false;
      },
      error: (er) => this.snackBarService.showError(er),
    });
  }

  saveWorkExperience() {
    this.isUpdated = true;
    const total = this.sharedAccordionFunctionality.newWorkExperiences.length;
    let saveCount = 0;
    let errorOccurred = false;

    this.sharedAccordionFunctionality.newWorkExperiences.forEach(
      (newWorkExperience) => {
        this.workExperienceService
          .saveWorkExperience(newWorkExperience)
          .subscribe({
            next: () => {
              saveCount++;
              if (saveCount === total && !errorOccurred) {
                this.snackBarService.showSnackbar('Saved', 'snack-success');
                this.hasUpdatedWorkExperience = true;
                this.addingWorkExperience = false;
                this.sharedAccordionFunctionality.newWorkExperiences = [];
                this.getWorkExperience();
              }
            },
            error: (er) => {
              errorOccurred = true;
              this.snackBarService.showError(er);
              this.addingWorkExperience = false;
              this.editWorkExperience = false;
            },
          });
      }
    );
  }

  updateWorkExperience() {
    this.isUpdated = true;
    this.editWorkExperience = false;
    const editedWorkExperienceArray = this.findDifferenceInArrays();
    const updateObservables = editedWorkExperienceArray.map((workExperience) =>
      this.workExperienceService.updateWorkExperience(workExperience)
    );
    forkJoin(updateObservables).subscribe({
      next: () => {
        this.snackBarService.showSnackbar('Updated', 'snack-success');
        this.hasUpdatedWorkExperience = true;
        this.getWorkExperience();
      },
      error: (er) => this.snackBarService.showError(er),
    });
  }
}
