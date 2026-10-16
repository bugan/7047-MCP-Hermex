import type { McpServer } from "@modelcontextprotocol/server";
import { API_CARS_URL } from "../config";
import { MeuErroCustomizado, ferramentaComTratamento } from "../erros";
import { getCarrosDisponiveisInputSchema, getCarrosDisponiveisOutputSchema } from "./schemas";

export function registerCars(server: McpServer) {
    server.registerTool(
        "get-carros-disponiveis",
        {
            description: "Busca a lista de carros disponiveis para locação na Hermex",
            inputSchema: getCarrosDisponiveisInputSchema,
            outputSchema: getCarrosDisponiveisOutputSchema,
        },
        ferramentaComTratamento(async (input) => {
            if (new Date(input.data).getTime() < Date.now()) {
                throw new MeuErroCustomizado("Data fora do intervalo aceito");
            }

            const carros = await fetch(`${API_CARS_URL}/naoexiete?category=${input.categoria}&cursor=${input.cursor}`);
            const carrosJson = await carros.json();

            return {
                structuredContent: {
                    carros: carrosJson.carros,
                    nextCursor: carrosJson.cursor.toString(),
                },
            };
        })
    );
}
