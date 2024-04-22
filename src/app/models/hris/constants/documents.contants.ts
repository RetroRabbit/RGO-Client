export const Document =[
    "Fixed Term Contract",
    "Retirement Annuity Form",
    "Medical Aid Form",
]

export interface FileCategory {
    name: string;
    id: number;
  }

export enum DocumentType {
    all,
    starterKit,
    additional
}

