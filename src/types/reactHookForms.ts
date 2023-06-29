import { FieldError, FieldErrorsImpl, FieldValues, Merge } from "react-hook-form";

export type ErrorArrayField<T extends FieldValues> =
  | Merge<FieldError, (Merge<FieldError, FieldErrorsImpl<T>> | undefined)[]>
  | undefined;
