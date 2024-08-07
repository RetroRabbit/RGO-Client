export interface WorkExperience {
    id: number,
    clientName: string,
    projectName: string,
    skillSet?: string[],
    software?: string[],
    startDate: Date,
    endDate: Date,
    projectDescription: string,
    employeeId: number
}