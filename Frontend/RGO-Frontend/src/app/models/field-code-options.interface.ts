import { FieldCode } from "./field-code.interface";

export interface FieldCodeOptions {
  id?: number; // Change from string to number for consistency with backend
  fieldCode?: FieldCode;
  option?: string;
}
