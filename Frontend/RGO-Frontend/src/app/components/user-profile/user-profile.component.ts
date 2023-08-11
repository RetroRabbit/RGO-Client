import { Token } from '@angular/compiler';
import { Component } from '@angular/core';
import { User } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GetUserProfile } from 'src/app/store/actions/userprofile.actions';
import { UserProfileState } from 'src/app/store/reducers/userprofile.reducer';
import { Skill } from 'src/app/models/skills.interface';
import { Certifications } from 'src/app/models/certifications.interface';
import { Project } from 'src/app/models/project.interface';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  UserProfile$: Observable<User> = this.store.select('user');
  isEdit: boolean = false;
  showNewSkill: boolean = false;
  editASkill: boolean = false;
  showNewCert: boolean = false;
  editACert: boolean = false;
  showNewProject: boolean = false;
  editAProject: boolean = false;
  // Profile Object
  phoneEdit: number = 0;
  bioEdit: string = '';
  discordEdit: string = '';
  codewarsEdit: string = '';
  gitHubEdit: string = '';
  linkedInEdit: string = '';
  emailEdit: string = '';
  editSkills: Skill[] = [];
  editCertifications: Certifications[] = [];
  editProjects: Project[] = [];
  // editing a skill
  editSkillTitle: string = '';
  editSkillDescription: string = '';
  editASkillTitle: string = '';
  editASkillDescription: string = '';
  editSkillIndex: number = -1;
  // editing a certification
  editCertTitle: string = '';
  editCertDescription: string = '';
  editACertTitle: string = '';
  editACertDescription: string = '';
  editCertIndex: number = -1;
  // editing a project
  editProjectName: string = '';
  editProjectDescription: string = '';
  editProjectRole: string = '';
  editAProjectName: string = '';
  editAProjectDescription: string = '';
  editAProjectRole: string = '';
  editProjectIndex: number = -1;
  constructor(private store: Store<{ user: UserProfileState }>) {}

  ngOnInit() {
    this.store.dispatch(GetUserProfile());
    this.UserProfile$.subscribe((data)=>{
      console.log(data);
    })
  }

  toggleEditMode(user: User) {
    this.isEdit = !this.isEdit;
    this.phoneEdit = user['userProfile'].phone;
    this.bioEdit = user['userProfile'].bioEdit;
    this.discordEdit = user['userProfile'].socials[0].discord;
    this.codewarsEdit = user['userProfile'].socials[0].codeWars;
    this.gitHubEdit = user['userProfile'].socials[0].gitHub;
    this.linkedInEdit = user['userProfile'].socials[0].linkedIn;

    this.editSkills = this.editSkills.concat(user['userProfile'].skills);
    this.editCertifications = this.editCertifications.concat(
      user['userProfile'].certifications
    );
    this.editProjects = this.editProjects.concat(user['userProfile'].projects);
    console.log(this.editProjects);
  }
  // save user
  save() {}

  cancel() {
    this.isEdit = !this.isEdit;
    this.editSkills = [];
    this.editCertifications = [];
    this.editProjects = [];
  }

  addSkill() {
    this.showNewSkill = true;
    console.log(this.editSkills);
  }

  saveSkill(profile: User) {
    this.showNewSkill = false;
    // console.log(this.editSkillTitle, this.editSkillDescription);
    let newSkill: Skill = {
      id: profile['userProfile'].skills.length + 1,
      userid: profile['userProfile'].id,
      title: this.editSkillTitle,
      description: this.editSkillDescription,
    };
    console.log(newSkill);
    // const newSkillArray : Skill[] = [newSkill];
    this.editSkills.push(newSkill);
    // this.editSkills = this.editSkills.concat(newSkillArray);
    console.log(this.editSkills);
    this.showNewSkill = false;
  }

  cancelSkill() {
    this.editSkillTitle = '';
    this.editSkillDescription = '';
    this.showNewSkill = false;
  }

  refreshEditSkill(user: User) {
    this.editSkills = user['userProfile'].skills;
  }

  removeSkill(skill: Skill, index: number) {
    this.editSkills.splice(index, 1);
    console.log(this.editSkills);
  }
  editSkill(skill: Skill, index: number) {
    this.editASkill = true;
    this.editSkillIndex = index;
    this.editASkillTitle = skill.title;
    this.editASkillDescription = skill.description;
  }

  saveEditSkill(skill: Skill, index: number) {
    const newSkill: Skill = {
      id: skill.id,
      userid: skill.userid,
      title: this.editASkillTitle,
      description: this.editASkillDescription,
    };
    this.editSkills.splice(index, 1, newSkill);
    this.editASkillTitle = this.editASkillDescription = '';
    this.editSkillIndex = -1;
    this.editASkillTitle = this.editASkillDescription = '';
  }

  cancelEditSkill() {
    this.editASkill = false;
    this.editSkillIndex = -1;
    this.editASkillTitle = this.editASkillDescription = '';
  }

  addCert() {
    this.showNewCert = true;
  }

  cancelCert() {
    this.editCertTitle = '';
    this.editCertDescription = '';
    this.showNewCert = false;
  }

  saveCert(profile: User) {
    this.showNewCert = false;
    const newCert: Certifications = {
      id: profile['userProfile'].certifications.length + 1,
      userid: profile['userProfile'].userid,
      title: this.editCertTitle,
      description: this.editCertDescription,
    };
    this.editCertifications.push(newCert);
    this.showNewCert = false;
    this.editACertTitle = this.editACertDescription = '';
  }

  removeCert(skill: Certifications, index: number) {
    this.editCertifications.splice(index, 1);
  }

  editCert(cert: Certifications, index: number) {
    this.editACert = true;
    this.editACertTitle = cert.title;
    this.editACertDescription = cert.description;
    this.editCertIndex = index;
  }

  saveEditCert(cert: Certifications, index: number) {
    const newCert: Certifications = {
      id: cert.id,
      userid: cert.userid,
      title: this.editACertTitle,
      description: this.editACertDescription,
    };
    this.editCertifications.splice(index, 1, newCert);
    this.editACertTitle = this.editACertDescription = '';
    this.editCertIndex = -1;
  }
  cancelEditCert() {
    this.editACertTitle = this.editACertDescription = '';
    this.editACert = false;
    this.editCertIndex = -1;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  addProject() {
    this.showNewProject = true;
  }

  cancelProject() {
    this.editProjectName = '';
    this.editProjectDescription = '';
    this.editProjectRole = '';
    this.showNewProject = false;
  }

  saveProject(profile: User) {
    this.showNewCert = false;
    const newProject: Project = {
      id: profile['userProfile'].certifications.length + 1,
      userid: profile['userProfile'].userid,
      name: this.editProjectName,
      role: this.editProjectRole,
      description: this.editProjectDescription,
    };
    this.editProjects.push(newProject);
    this.showNewProject = false;

    this.editProjectName = '';
    this.editProjectDescription = '';
    this.editProjectRole = '';
  }

  removeProject(skill: Project, index: number) {
    this.editProjects.splice(index, 1);
  }

  editProject(proj: Project, index: number) {
    this.editAProject = true;
    this.editAProjectName = proj.name;
    this.editAProjectDescription = proj.description;
    this.editAProjectRole = proj.role;
    this.editProjectIndex = index;
  }

  saveEditProject(proj: Project, index: number) {
    const newProject: Project = {
      id: proj.id,
      userid: proj.userid,
      name: this.editAProjectName,
      role: this.editAProjectRole,
      description: this.editAProjectDescription,
    };
    this.editProjects.splice(index, 1, newProject);
    this.editAProjectName =
      this.editAProjectDescription =
      this.editAProjectRole =
        '';
    this.editProjectIndex = -1;
  }
  cancelEditProject() {
    this.editProjectName = '';
    this.editProjectDescription = '';
    this.editProjectRole = '';
    this.editAProject = false;
    this.editProjectIndex = -1;
  }
}
