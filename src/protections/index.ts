import type { McpServer } from "@modelcontextprotocol/server";
import { API_PROTECTIONS_URL } from "../config";
import { ferramentaComTratamento } from "../erros";
import { getSegurosOutputSchema } from "./schemas";

export function registerProtections(server: McpServer) {
    server.registerTool(
        "get-seguros",
        {
            description: "Lista os planos de seguro (proteção) disponíveis para locação na Hermex",
            outputSchema: getSegurosOutputSchema,
        },
        ferramentaComTratamento(async () => {
            const seguros = await fetch(API_PROTECTIONS_URL);
            const segurosJson = await seguros.json();
            return {
                structuredContent: segurosJson,
            };
        })
    );
}
