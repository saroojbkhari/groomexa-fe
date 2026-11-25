import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import type { IApiError } from "@/typings/common";

/**
 * Shows a failed API call on a react-hook-form form:
 * field errors go under their inputs (first one gets focus), anything else becomes the form's root error.
 * `codeFields` routes error codes without field details to a field, e.g. { EMAIL_TAKEN: "email" }.
 */
export function applyApiError<T extends FieldValues>(
  form: UseFormReturn<T>,
  failure: IApiError,
  codeFields: Partial<Record<string, Path<T>>> = {},
) {
  const known = new Set(Object.keys(form.getValues()));
  const fieldErrors: Record<string, string> = { ...failure.fieldErrors };
  const codeField = codeFields[failure.code];
  if (codeField) fieldErrors[codeField] = failure.message;

  let focused = false;
  for (const [name, message] of Object.entries(fieldErrors)) {
    if (!known.has(name)) continue;
    form.setError(name as Path<T>, { type: "server", message }, { shouldFocus: !focused });
    focused = true;
  }
  if (!focused) form.setError("root", { type: "server", message: failure.message });
}
