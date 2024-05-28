export interface EmployeeSalary {
    id: number,
    employeeId: number,
    salary: number,
    minSalary?: number,
    maxSalary?: number,
    remuneration: number,
    band?: number,
    contribution?: string,
    salaryUpdateDate: Date;
}