import { ResourceTemplate, type McpServer } from "@modelcontextprotocol/server";
import localidades_mg from "../../resources/localidades-mg.json";
import localidades_sp from "../../resources/localidades-sp.json";
import { API_LOCATIONS_URL } from "../config";
import { ferramentaComTratamento } from "../erros";
import { getLocalizacoesOutputSchema } from "./schemas";

const localidadesPorEstado: Record<string, unknown> = {
    sp: localidades_sp,
    mg: localidades_mg,
};

export function registerLocations(server: McpServer) {
    server.registerTool(
        "get-localizacoes",
        {
            description: "Lista as localizações disponíveis para retirada e devolução de veículos na Hermex",
            outputSchema: getLocalizacoesOutputSchema,
        },
        ferramentaComTratamento(async () => {
            const localizacoes = await fetch(API_LOCATIONS_URL);
            const localizacoesJson = await localizacoes.json();
            return {
                structuredContent: localizacoesJson,
            };
        })
    );

    server.registerResource(
        "hermex-localidades",
        new ResourceTemplate("file://hermex/localidades/{estado}", {
            list: async () => ({
                resources: [
                    { uri: "file://hermex/localidades/sp", name: "localidade sp" },
                    { uri: "file://hermex/localidades/mg", name: "localidade mg" },
                ],
            }),
        }),
        {
            title: "localidades Hermex",
            mimeType: "text/json",
            description: "Documento com as localidades da lojas da hermex",
        },
        async (uri, { estado }) => {
            const arquivo = typeof estado === "string" ? localidadesPorEstado[estado] : undefined;
            return {
                contents: [
                    {
                        uri: uri.href,
                        mimetype: "text/json",
                        text: JSON.stringify(arquivo),
                    },
                ],
            };
        }
    );
}
