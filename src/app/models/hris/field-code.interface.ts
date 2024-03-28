import { FieldCodeOptions } from "./field-code-options.interface";

export class FieldCode {
  
  FieldCode(){
    this.id = 0;
  }
  
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
  required?: boolean;
}
