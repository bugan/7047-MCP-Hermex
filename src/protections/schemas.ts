import { z } from "zod";

export const seguroSchema = z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    pricePerDay: z.number().min(0),
    benefits: z.array(z.string()),
});

export const getSegurosOutputSchema = z.array(seguroSchema);
