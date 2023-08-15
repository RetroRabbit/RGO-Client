import { Project } from "./project.interface"
import { Social } from "./social.interface"
import { Skill } from "./skills.interface"
import { Certifications } from "./certifications.interface"

export interface UserProfile{
  id : number,
  gradGroupId : number
  firstName: string,
  lastName:string,
  email: string,
  type: number,
  joinDate : Date,
  status: 1,
  level?: number,
  bio?: string,
  phone?: string,
  skills : Skill[],
  socials : Social[],
  certifications : Certifications[],
  projects : Project[]
};
