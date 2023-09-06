// export interface FieldCode {
//   code?: string;
//   name?: string;
//   description?: string;
//   regex?: string;
//   type?: string;
//   status?: string;
// }

export interface FieldCode {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  regex?: string;
  type?: string;
  status?: string;
  internal?: boolean;
  internalTable?: string;
}
