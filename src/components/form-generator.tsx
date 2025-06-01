import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props<T extends FieldValues> {
  type?: "text" | "email" | "password" | "number";
  inputType: "input" | "textarea" | "select" | "custom"; 
  options?: {
    label: string;
    value: string;
  }[];
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  name: Path<T>;
  errors: FieldErrors<FieldValues>;
  lines?: number;
  children?: React.ReactNode;
  register: UseFormRegister<T>;
}

export const FormGenerator = <T extends FieldValues>({
  type,
  inputType,
  options,
  label,
  placeholder,
  className,
  name,
  disabled,
  errors,
  lines,
  children,
  register
}: Props<T>) => {
  switch (inputType) {
    case "input":
      return (
        <Label htmlFor={`input-${label}`} className="flex flex-col gap-1.5 items-start">
          {label && label}
          <Input 
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
            {...register(name)}
          />
          <ErrorMessage 
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-500 text-xs">{message === "Required" ? "" : message}</p>
            )}
          />
        </Label>
      );
    case "custom":
      return (
        <Label htmlFor={`input-${label}`} className="flex flex-col gap-1.5 items-start">
          {label && label}
          {children}
          <ErrorMessage 
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-500 text-xs">{message === "Required" ? "" : message}</p>
            )}
          />
        </Label>
      );
    default:
      break;
  }
}