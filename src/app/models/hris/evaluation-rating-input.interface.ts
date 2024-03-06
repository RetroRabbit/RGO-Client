import { EvaluationInput } from "./evaluation-input.interface";

export interface EvaluationRatingInput {
    id: number | null,
    employeeEmail: string,
    evaluation: EvaluationInput,
    description: string,
    score: number,
    comment: string
}