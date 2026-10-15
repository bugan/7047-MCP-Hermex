import { ProtocolError, ProtocolErrorCode, type McpServer } from "@modelcontextprotocol/server";
import { API_CARS_URL } from "../config";
import { getCarrosDisponiveisInputSchema, getCarrosDisponiveisOutputSchema } from "./schemas";

export function registerCars(server: McpServer) {
    server.registerTool(
        "get-carros-disponiveis",
        {
            description: "Busca a lista de carros disponiveis para locação na Hermex",
            inputSchema: getCarrosDisponiveisInputSchema,
            outputSchema: getCarrosDisponiveisOutputSchema,
        },
        async (input) => {

            if(new Date(input.data).getTime() < Date.now()){
                throw new Error("Data fora do intervalo aceito")
                return{
                    content:[{
                        type: "text",
                        text: "Data fora do intervalo aceito"
                    }],
                    isError:true
                }
            }
        
            const carros = await fetch(`${API_CARS_URL}/naoexiete?category=${input.categoria}&cursor=${input.cursor}`);
            const carrosJson = await carros.json();
            if(carros.status == 404){
                throw new ProtocolError(ProtocolErrorCode.InternalError,"Erro interno do Servidor");
            }
new 

            return {
                structuredContent: {
                    carros: carrosJson.carros,
                    nextCursor: carrosJson.cursor.toString(),
                },
            };
           
        }
    );
}
