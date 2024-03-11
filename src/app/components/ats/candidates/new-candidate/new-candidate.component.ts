import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { CandidateService } from 'src/app/services/ats/candidate/candidate.service';

@Component({
  selector: 'app-new-candidate',
  templateUrl: './new-candidate.component.html',
  styleUrls: ['./new-candidate.component.css']
})
export class NewCandidateComponent {
  newEmployeeForm: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private candidateService: CandidateService,
    private cookieService: CookieService,
    private router: Router,
    private snackBarService: SnackbarService,
    private _formBuilder: FormBuilder,
    private navService: NavService
  ) { }

  imagePreview: string | ArrayBuffer | null = null;
  previewImage: string = '';
  imageUrl: string = '';
  imageName: string = "";
  emailPattern = /^[A-Za-z0-9._%+-]+@$/;
  namePattern = /^[a-zA-Z\s'-]*$/;
  isMobileScreen = false;
  screenWidth = window.innerWidth;
  PREVIOUS_PAGE = 'previousPage';

  newcandidateForm = new FormGroup({
      name: new FormControl<string>('', [Validators.required,
      Validators.pattern(this.namePattern)]), 
      surname: new FormControl<string>('', [Validators.required,
      Validators.pattern(this.namePattern)]),
      email: new FormControl<string>('', [Validators.required, 
      Validators.email, Validators.pattern(this.emailPattern)]),
    }
  )

  ngOnInit(): void {
    this.navService.showNavbar = false;
  }

  ngOnDestroy() {
    this.navService.showNavbar = true;
  }


  onSubmit(reset: boolean = false): void {
  }

  goToPreviousPage() {
    this.router.navigateByUrl(this.cookieService.get(this.PREVIOUS_PAGE));
  }

  validateFile(file: File): boolean {
    if (file.size > 4194304) {
      return false;
    }
    return true;
  }

  clearUpload() {
    var input = document.getElementById('imageUpload') as HTMLInputElement;
    input.value = '';
  }

  imageConverter(file: File) {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      this.imagePreview = reader.result as string;
      const base64Image = this.convertTobase64(this.imagePreview);
      this.newEmployeeForm.patchValue({ 'photo': 'data:image/jpeg;base64,' + base64Image });
      this.getImageFromBase64(base64Image);
    });

    reader.readAsDataURL(file);
  }
  convertTobase64(imagePreview: string) {
    throw new Error('Method not implemented.');
  }
  getImageFromBase64(base64Image: any) {
    throw new Error('Method not implemented.');
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.imageName = file.name;
      if (this.validateFile(file)) {
        this.imageConverter(file);
      } else {
        this.clearUpload();
      }
    }


  }
}
