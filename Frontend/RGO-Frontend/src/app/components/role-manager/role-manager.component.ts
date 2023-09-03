import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.css']
})
export class RoleManagerComponent {
  rawRoles$!: Observable<any>

  newRoleForm = new FormGroup({
    role: new FormControl('', Validators.required),
    permission: new FormControl('', Validators.required),
  })

  controles = Object.keys(this.newRoleForm.controls)

  constructor(private roleService: RoleService) { }


  ngOnInit(): void {
    this.rawRoles$ = this.roleService.getAllRoles()
  }

  getRoles(raw: any): string[] {
    return Object.keys(raw)
  }

  getPermissions(raw: any): string[] {

    return Object.values(raw).join(',').split(',')
  }
}