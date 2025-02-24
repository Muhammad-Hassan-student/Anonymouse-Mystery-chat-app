import { z } from "zod";

export const verifySchema = z.object({
  code: z
    .string()
    .length(6, " Verifucation code must be at least 6 digits")
    
});
