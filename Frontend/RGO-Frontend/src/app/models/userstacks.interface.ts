import { Stacks } from "./stacks.interface";

export interface Userstacks{
    userId: number;
    backend: Stacks;
    frontend: Stacks;
    database: Stacks;
    createDate: Date;
    description: string;
    status: number;
}