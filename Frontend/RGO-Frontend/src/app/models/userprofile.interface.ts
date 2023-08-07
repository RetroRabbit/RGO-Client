import { Project } from "./project.interface"
import { Social } from "./social.interface"
import { Skill } from "./skills.interface"
import { Certifications } from "./certifications.interface"

export interface User{
  id : number,
  groupdid : number
  firstName: string,
  lastName:string,
  email: string,
  type: number,
  joinDate : Date,
  status: 1,
  skill : Skill[],
  certifications : Certifications[],
  project : Project[],
  social : Social
};