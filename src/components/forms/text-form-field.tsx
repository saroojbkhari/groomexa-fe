"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  /** Hint shown under the input while it has no error. */
  description?: ReactNode;
  /** Password input with a show/hide toggle. */
  revealable?: boolean;
} & Omit<ComponentProps<"input">, "name" | "value" | "defaultValue" | "onChange" | "onBlur">;

/** react-hook-form text input: label, input, hint and error wired together (incl. aria-invalid / aria-describedby). */
export function TextFormField<T extends FieldValues>({ control, name, label, description, revealable, type, className, ...input }: Props<T>) {
  const id = useId();
  const [shown, setShown] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <div className="relative">
            <Input
              {...input}
              {...field}
              value={field.value ?? ""}
              id={id}
              type={revealable ? (shown ? "text" : "password") : type}
              aria-invalid={fieldState.invalid}
              aria-describedby={fieldState.invalid ? `${id}-error` : description ? `${id}-hint` : undefined}
              className={revealable ? "pr-12" : undefined}
            />
            {revealable && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-pressed={shown}
                aria-label={shown ? "Hide password" : "Show password"}
                onClick={() => setShown((v) => !v)}
                className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
              >
                {shown ? <EyeOff /> : <Eye />}
              </Button>
            )}
          </div>
          {fieldState.invalid ? (
            <FieldError id={`${id}-error`} errors={[fieldState.error]} />
          ) : (
            description && <FieldDescription id={`${id}-hint`}>{description}</FieldDescription>
          )}
        </Field>
      )}
    />
  );
}
