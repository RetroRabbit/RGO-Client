export interface EmployeeCertificates{
    id: number,
    employeeId: number,
    certificateName: string,
    issueOrganization: string,
    issueDate: Date,
    certificateDocument: string,
    documentName: string
}