export interface FieldCodeData {
  fieldCode: {
    id: number;
    code: string;
    name: string;
    description?: string;
    regex?: string;
    type?: string | null;
    status?: string;
    internal?: boolean;
    internalTable?: string;
  };
  fieldCodeOption: {
    id: number;
    option: string;
  };
}