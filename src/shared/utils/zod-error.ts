import z from "zod";

export const parseZodError = (error: z.ZodError, field: string) => {
  return (z.flattenError(error).fieldErrors as Record<string, string[] | undefined>)[field]?.[0] ?? "";
};
