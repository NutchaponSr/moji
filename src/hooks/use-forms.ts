import { 
  DefaultValues, 
  FieldValues, 
  useForm,
  UseFormReturn 
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface UseFormHook<T extends FieldValues> {
  defaultValues: DefaultValues<T>;
  schema: z.ZodSchema<T>;
}

export const useForms = <T extends FieldValues>({ defaultValues, schema }: UseFormHook<T>): UseFormReturn<T> => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  return form;
}