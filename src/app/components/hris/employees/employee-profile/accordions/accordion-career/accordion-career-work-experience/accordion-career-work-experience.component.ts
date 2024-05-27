import { Component, HostListener, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { AuthAccessService } from 'src/app/services/shared-services/auth-access/auth-access.service';
import { SharedPropertyAccessService } from 'src/app/services/hris/shared-property-access.service';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { SharedAccordionFunctionality } from 'src/app/components/hris/employees/employee-profile/shared-accordion-functionality';
import { WorkExperience } from 'src/app/models/hris/work-experience.interface';
import { WorkExperienceService } from 'src/app/services/hris/employee/employee-work-experience.service';
import { EmployeeProfile } from 'src/app/models/hris/employee-profile.interface';
import { SimpleEmployee } from 'src/app/models/hris/simple-employee-profile.interface';
import { ROLES } from 'src/app/models/hris/constants/employee-skills-software-onType.constants';
import { Dialog } from 'src/app/models/hris/confirm-modal.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-accordion-career-work-experience',
  templateUrl: './accordion-career-work-experience.component.html',
  styleUrls: ['./accordion-career-work-experience.component.css']
})
export class AccordionCareerWorkExperienceComponent {

  screenWidth = window.innerWidth;

  @HostListener('window:resize',['$event'])
  onResize(){
    this.screenWidth = window.innerWidth;
  }

  panelOpenState: boolean = false;
  @Input() WorkExperience!: { workExperience: WorkExperience }
  @Input() employeeProfile !: EmployeeProfile | SimpleEmployee

  workExperienceFormProgress: number = 0;
  editWorkExperience: boolean = false;
  workExperienceDto !: any;
  workExperience: WorkExperience[] = [];
  workExperienceData: any = [];
  hasWorkExperienceData: boolean = false;
  workExperienceId: number | undefined = 0;
  isUpdated: boolean = false;
  hasUpdatedWorkExperience: boolean = false;
  addingWorkExperience: boolean = false;
  showConfirmDialog: boolean = false;
  removeNewOrUpdate: string = '';
  removeIndex: number = 0;
  newWorkExperienceIndex: number | null = null;

  copyOfWorkExperience: WorkExperience[] = [];
  newWorkExperience: WorkExperience[] = [];

  role: string | undefined = '';
  skillSetList: string[] = [];
  softwareList: string[] = [];

  dialogTypeData: Dialog = {
    type: 'confirm',
    title: 'Delete certificate',
    subtitle: 'Are you sure you want to delete?',
    confirmButtonText: 'Delete',
    denyButtonText: "Cancel"
  };

  constructor(
    private fb: FormBuilder,
    private workExperienceService: WorkExperienceService,
    private snackBarService: SnackbarService,
    public authAccessService: AuthAccessService,
    public sharedPropertyAccessService: SharedPropertyAccessService,
    public sharedAccordionFunctionality: SharedAccordionFunctionality) {
  }

  ngOnInit(): void {
    this.getEmployeeType();
    this.getWorkExperience();
  }

  getEmployeeType() {
    this.role = this.employeeProfile?.employeeType?.name;
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
        this.skillSetList = ["No skill set available for this employee type"];
        this.softwareList = ["No software is available for this employee type"];
        break;
    }
  }

  getWorkExperience() {
    this.workExperienceService.getWorkExperience(this.employeeProfile.id).subscribe({
      next: (data) => {
        this.workExperienceData = data;
        console.log(this.workExperienceData);
      },
      error: (error) => {
      }
    });
  }

  addNewWorkExperience() {
    this.addingWorkExperience = true;
    const newWorkExperience: WorkExperience = {
      id: 0,
      clientName: '',
      projectName: '',
      skillSet: [],
      software: [],
      startDate: new Date,
      endDate: new Date,
      employeeId: this.employeeProfile.id as number
    }
    this.newWorkExperience.push(newWorkExperience);
  }

  findDifferenceInArrays(): WorkExperience[] {
    let differenceArray: WorkExperience[] = [];

    for (let i = 0; i < this.workExperience.length; i++) {
      if (this.workExperience[i].clientName != this.copyOfWorkExperience[i].clientName)
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (this.workExperience[i].projectName != this.copyOfWorkExperience[i].projectName)
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (this.workExperience[i].skillSet != this.copyOfWorkExperience[i].skillSet)
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (this.workExperience[i].software != this.copyOfWorkExperience[i].software)
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (this.workExperience[i].startDate != this.copyOfWorkExperience[i].startDate)
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (this.workExperience[i].endDate != this.copyOfWorkExperience[i].endDate)
        differenceArray.push(this.copyOfWorkExperience[i]);
      else if (this.workExperience[i].employeeId != this.copyOfWorkExperience[i].employeeId)
        differenceArray.push(this.copyOfWorkExperience[i]);
    }
    return differenceArray
  }

  editWorkExperiences() {
    this.editWorkExperience = true;
    this.copyOfWorkExperience = [];
    this.copyWorkExperiences();
  }

  cancelWorkExperienceEdit() {
    this.editWorkExperience = false;
    this.addingWorkExperience = false;
    this.copyOfWorkExperience = this.workExperience;
    if (this.newWorkExperienceIndex !== null) {
      this.newWorkExperience.splice(this.newWorkExperienceIndex, 1);
      this.newWorkExperienceIndex = null;
    }
    this.newWorkExperience = [];
  }

  copyWorkExperiences() {
    this.workExperience.forEach(workExperience => {
      const copiedExperience = JSON.parse(JSON.stringify(workExperience));
      this.copyOfWorkExperience.push(copiedExperience);
    });
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
      }
      else {
        this.removeExistingWorkExperience(this.removeIndex);
      }
    }
  }

  removeNewWorkExperience(index: number) {
    this.addingWorkExperience = false;
    this.newWorkExperience.splice(index, 1);
  }

  removeExistingWorkExperience(index: number) {
    this.workExperienceId = this.copyOfWorkExperience[index].id;
    this.workExperienceService.delete(this.workExperienceId).subscribe({
      next: () => {
        this.snackBarService.showSnackbar("Experience deleted", "snack-success");
        this.copyOfWorkExperience.splice(index, 1);
        this.workExperience.splice(index, 1);
        this.editWorkExperience = false;
      },
      error: (error) => {
        this.snackBarService.showSnackbar("Unable to delete", "snack-error");
      }
    });
  }

  saveWorkExperience() {
    this.isUpdated = true;
    const total = this.newWorkExperience.length;
    let saveCount = 0;
    let errorOccurred = false;

    this.newWorkExperience.forEach(newWorkExperience => {
      this.workExperienceService.save(newWorkExperience).subscribe({
        next: () => {
          saveCount++;
          if (saveCount === total && !errorOccurred) {
            this.snackBarService.showSnackbar("Work experience info updated", "snack-success");
            this.hasUpdatedWorkExperience = true;
            this.addingWorkExperience = false;
            this.newWorkExperience = [];
            this.getWorkExperience();
          }
        },
        error: (error) => {
          errorOccurred = true;
          this.snackBarService.showSnackbar("Unable to update work experience", "snack-error");
          this.addingWorkExperience = false;
          this.editWorkExperience = false;
        }
      });
    });
  }

  updateWorkExperience() {
    this.isUpdated = true;
    this.editWorkExperience = false;
    const editedWorkExperienceArray = this.findDifferenceInArrays();
    const updateObservables = editedWorkExperienceArray.map(workExperience =>
      this.workExperienceService.update(workExperience)
    );
    forkJoin(updateObservables).subscribe({
      next: () => {
        this.snackBarService.showSnackbar("Work experience info updated", "snack-success");
        this.hasUpdatedWorkExperience = true;
        this.getWorkExperience();
      },
      error: () => {
        this.snackBarService.showSnackbar("Unable to update all fields", "snack-error");
      }
    });
  }
}
