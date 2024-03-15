import { PropertyAccessLevel } from "./constants/enums/property-access-levels.enum";
import { Role } from "./role.interface";

export interface PropertyAccess {
    id: number,
    roleId: number,
    role: Role,
    table: string,
    field: string,
    accessLevel: PropertyAccessLevel
}