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
  workExperienceId: number = 0;
  isUpdated: boolean = false;
  hasUpdatedWorkExperience: boolean = false;

  role: string | undefined = '';
  skillSetList: string[] = [];
  softwareList: string[] = [];

  skillSetListForDeveloper: string[] = ['JavaScript', 'TypeScript', 'Angular', 'React', 'Node.js', 'Python', 'Java', 'C#', 'Ruby', 'Swift', 'Kotlin', 'SQL', 'HTML/CSS'];
  softwareListForDeveloper: string[] = ['VS Code', 'WebStorm', 'PyCharm', 'Eclipse', 'IntelliJ IDEA', 'Visual Studio', 'Git', 'Docker', 'Jenkins', 'AWS', 'Azure'];

  skillSetListForDesigner: string[] = ['Photoshop', 'Illustrator', 'Figma', 'Sketch', 'Adobe XD', 'InDesign', 'UX/UI Design', 'Graphic Design', 'Web Design', 'Branding', 'Typography', 'Wireframing', 'Prototyping'];
  softwareListForDesigner: string[] = ['Adobe Photoshop', 'Adobe Illustrator', 'Sketch', 'Figma', 'Adobe XD', 'InDesign', 'CorelDRAW', 'Affinity Designer'];

  skillSetListForScrumMaster: string[] = ['Agile Methodologies', 'Scrum Framework', 'Project Management', 'Team Facilitation', 'Sprint Planning', 'Retrospectives', 'JIRA', 'Confluence', 'Communication', 'Leadership'];
  softwareListForScrumMaster: string[] = ['JIRA', 'Confluence', 'Trello', 'Asana', 'Microsoft Project', 'Slack', 'Zoom', 'Miro', 'Microsoft Teams'];

  skillSetListForBusinessSupport: string[] = ['Administration', 'Office Management', 'Customer Service', 'Data Entry', 'Scheduling', 'Communication', 'Problem Solving', 'Microsoft Office Suite'];
  softwareListForBusinessSupport: string[] = ['Microsoft Office (Word, Excel, PowerPoint, Outlook)', 'Google Workspace (Docs, Sheets, Slides, Calendar)', 'Trello', 'Asana', 'Slack', 'Zoom'];

  skillSetListForAccountManager: string[] = ['Sales', 'Customer Relationship Management', 'Negotiation', 'Communication', 'Strategic Planning', 'Product Knowledge', 'CRM Software'];
  softwareListForAccountManager: string[] = ['Salesforce', 'HubSpot', 'Microsoft Dynamics', 'Zoho CRM', 'Pipedrive', 'Trello', 'Asana', 'Microsoft Office'];

  skillSetListForPeopleChampions: string[] = ['Recruitment', 'Employee Relations', 'Talent Management', 'Performance Management', 'HR Policies', 'Training and Development', 'Communication', 'Conflict Resolution'];
  softwareListForPeopleChampions: string[] = ['Workday', 'SAP SuccessFactors', 'BambooHR', 'ADP Workforce Now', 'Greenhouse', 'Lever', 'LinkedIn Recruiter', 'Microsoft Office'];

  skillSetListForExecutives: string[] = ['Leadership', 'Strategic Planning', 'Financial Acumen', 'Decision Making', 'Communication', 'Risk Management', 'Negotiation', 'Business Development'];
  softwareListForExecutives: string[] = ['Microsoft Office (Excel, PowerPoint, Word)', 'Google Workspace', 'Trello', 'Asana', 'Slack', 'Zoom', 'Microsoft Teams', 'SAP', 'Oracle'];

  workExperienceForm: FormGroup = this.fb.group({
    clientName: { value: '', disabled: true },
    projectName: { value: '', disabled: true },
    skillSet: { value: '', disabled: true },
    software: { value: '', disabled: true },
    startDate: { value: '', disabled: true },
    endDate: { value: '', disabled: true },
    employeeId: { value: '', disabled: true }
  });

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
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
        this.skillSetList = this.skillSetListForDeveloper;
        this.softwareList = this.softwareListForDeveloper;
        break;
      case 'Designer':
        this.skillSetList = this.skillSetListForDesigner;
        this.softwareList = this.softwareListForDesigner;
        break;
      case 'Scrum Master':
        this.skillSetList = this.skillSetListForScrumMaster;
        this.softwareList = this.softwareListForScrumMaster;
        break;
      case 'Business Support':
        this.skillSetList = this.skillSetListForBusinessSupport;
        this.softwareList = this.softwareListForBusinessSupport;
        break;
      case 'Account Manager':
        this.skillSetList = this.skillSetListForAccountManager;
        this.softwareList = this.softwareListForAccountManager;
        break;
      case 'People Champion':
        this.skillSetList = this.skillSetListForPeopleChampions;
        this.softwareList = this.softwareListForPeopleChampions;
        break;
      case 'Executive':
        this.skillSetList = this.skillSetListForExecutives;
        this.softwareList = this.softwareListForExecutives;
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
        if (this.workExperience != null) {
          this.workExperienceId = this.workExperience[this.workExperience.length - 1].id;
        }
        this.initializeForm(this.workExperience[this.workExperience.length - 1]);
      }
    })
  }

  initializeForm(workExperienceDetails: WorkExperience) {
    if(workExperienceDetails == null) {
      this.hasWorkExperienceData = false;
      return;
    }
    this.workExperienceForm = this.fb.group({
      clientName: [{ value: workExperienceDetails.clientName, disabled: true }, Validators.required],
      projectName: [{ value: workExperienceDetails.projectName, disabled: true }, Validators.required],
      skillSet: [{ value: workExperienceDetails.skillSet, disabled: true }, Validators.required],
      software: [{ value: workExperienceDetails.software, disabled: true }, Validators.required],
      startDate: [{ value: workExperienceDetails.startDate, disabled: true }, Validators.required],
      endDate: [{ value: workExperienceDetails.endDate, disabled: true }, Validators.required],
      employeeId: [{ value: workExperienceDetails.employeeId, disabled: true }, Validators.required]
    });
    this.workExperienceForm.disable();
    this.hasWorkExperienceData = true;
    this.checkWorkExperienceFormProgress();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  addWorkExperience() {
    console.log("Add another document");
  }

  editWorkExperiences() {
    this.editWorkExperience = true;
    this.workExperienceForm.enable();
  }

  cancelWorkExperienceEdit() {
    this.editWorkExperience = false;
    this.workExperienceForm.disable();
  }

  saveWorkExperience() {
    this.editWorkExperience = false;
    this.isUpdated = true;
    const workExperienceFormValue = this.workExperienceForm.value;

    const startDate = this.formatDate(this.workExperienceForm.value.startDate);
    const endDate = this.formatDate(this.workExperienceForm.value.endDate);

    this.workExperienceDto = {
      id: this.workExperienceId,
      clientName: workExperienceFormValue.clientName,
      projectName: workExperienceFormValue.projectName,
      skillSet: workExperienceFormValue.skillSet,
      software: workExperienceFormValue.software,
      startDate: startDate,
      endDate: endDate,     
      employeeId: this.employeeProfile?.id
    };

    if (this.hasWorkExperienceData) {
      this.workExperienceService.update(this.workExperienceDto).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Work experience details updated", "snack-success");
          this.getWorkExperience();
          this.checkWorkExperienceFormProgress();
          this.hasUpdatedWorkExperience = true;
          this.editWorkExperience = false;
          this.workExperienceForm.disable();
        },
        error: (error) => {
          this.snackBarService.showSnackbar(error, "snack-error");
        }
      })
    }
    else {
      this.workExperienceService.save(this.workExperienceDto).subscribe({
        next: () => {
          this.snackBarService.showSnackbar("Work experience details added", "snack-success");
          this.getWorkExperience();
          this.checkWorkExperienceFormProgress();
          this.hasUpdatedWorkExperience = true;
          this.editWorkExperience = false;
          this.workExperienceForm.disable();
        }
        , error: (error) => {
          this.snackBarService.showSnackbar("Failed to create Work experience details", "snack-error");
        }
      })
    }
  }

  checkWorkExperienceFormProgress() {
    let filledCount = 0;
    const formControls = this.workExperienceForm.controls;
    const totalFields = Object.keys(this.workExperienceForm.controls).length;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.value != null && control.value != '') {
          filledCount++;
        }
      }
    }
    this.workExperienceFormProgress = Math.round((filledCount / totalFields) * 100);
  }
}
