import { EmployeeProfile } from "./employee-profile.interface";

export interface EmployeeCertificates{
    Id: number,
    EmployeeId: number,
    CertficateName: string,
    IssueOrganization: string,
    IssueDate: Date,
    CertificateDocument: string
}