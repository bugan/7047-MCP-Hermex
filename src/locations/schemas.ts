import { z } from "zod";

export const localizacaoSchema = z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    state: z.string(),
});

export const getLocalizacoesOutputSchema = z.array(localizacaoSchema);
