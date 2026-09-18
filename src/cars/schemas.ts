import { z } from "zod";

export const getCarrosDisponiveisInputSchema = z.object({
    categoria: z.string().optional().default("").describe("Filtro da lista de carros por categoria"),
    cursor: z.string().optional().describe("Cursor resposável pela páginação"),
});

export const carroSchema = z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
    pricePerDay: z.number().min(0),
    image: z.string(),
    images: z.array(z.string()),
    features: z.array(z.string()),
    seats: z.number(),
    bags: z.number(),
    transmission: z.string(),
    available: z.boolean(),
});

export const getCarrosDisponiveisOutputSchema = z.object({
    carros: z.array(carroSchema),
    nextCursor: z.string(),
});
