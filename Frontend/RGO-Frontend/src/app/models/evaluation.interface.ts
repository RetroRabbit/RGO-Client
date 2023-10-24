export interface Evaluation {
    id: number
    employeeId: number
    templateId: number
    ownerId: number
    subject: string
    startDate: Date
    endDate: Date | null
}