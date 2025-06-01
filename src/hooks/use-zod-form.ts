import { z, ZodSchema } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "@tanstack/react-query";

export const useZodForm = <T extends ZodSchema>(
  schema: T,
  mutation: UseMutateFunction<unknown, unknown, z.infer<T>>,
  defaultValues: z.infer<T>,
) => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onFormSubmit = handleSubmit(async (values) => console.table(values)) 

  return {
    register,
    watch,
    reset,
    onFormSubmit,
    errors,
    setValue,
  }
}