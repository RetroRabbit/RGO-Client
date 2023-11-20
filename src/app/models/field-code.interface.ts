import { FieldCodeOptions } from "./field-code-options.interface";

export interface FieldCode {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  regex?: string;
  type?: number;
  status?: number;
  internal?: boolean;
  internalTable?: string;
  options?: FieldCodeOptions[];
  category?: number;
}
