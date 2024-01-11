import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AuthAccessService{
    private roles: string = '';

    setRoles(roles: string){
        this.roles = roles;
    }

    getRoles(){
        return this.roles;
    }

    isAdmin(){
        return this.roles.includes('Admin');
    }

    isSuperAdmin(){
        return this.roles.includes('SuperAdmin');
    }

    isTalent(){
        return this.roles.includes('Talent');
    }

    isJourney(){
        return this.roles.includes('Journey');
    }

    isEmployee(){
        return this.roles.includes('Employee');
    }
}