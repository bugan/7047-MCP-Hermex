import { McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import { z } from "zod";
import localidades_sp from "./resources/localidades-sp.json";
import localidades_mg from "./resources/localidades-mg.json";


const API_BASE_URL = "http://localhost:3333";
const API_CARS_URL = `${API_BASE_URL}/api/cars`;
const API_RESERVATIONS_URL = `${API_BASE_URL}/api/reservations`;
const API_LOCATIONS_URL = `${API_BASE_URL}/api/locations`;
const API_PROTECTIONS_URL = `${API_BASE_URL}/api/protections`;



const server = new McpServer(
    { name: "hermex-server", version: "1.0.0" },
    {
        capabilities: {
            resources: {listChanged: true},
            prompts:{listChanged: true}
        }
    }

);
const app = createMcpExpressApp();

app.all("/mcp", async (req: Request, res: Response) => {
    const transport = new NodeStreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);

    // If you use Express JSON parsing, pass the pre-parsed body to avoid re-reading the stream.
    await transport.handleRequest(req, res, req.body);
});

server.registerTool(
    "get-carros-disponiveis",
    {
        description: "Busca a lista de carros disponiveis para locação na Hermex",
        inputSchema: z.object({
            categoria: z.string().optional().default("").describe("Filtro da lista de carros por categoria"),
            cursor: z.string().optional().describe("Cursor resposável pela páginação"),
        }),
        outputSchema: z.object({
            carros: z.array(
                z.object({
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
                })),
            nextCursor:z.string()
        }),
    },
    async (input) => {
        const carros = await fetch(`${API_CARS_URL}?category=${input.categoria}&cursor=${input.cursor}`);
        const carrosJson = await carros.json();
        return {
            structuredContent: {
                carros: carrosJson.carros,
                nextCursor: carrosJson.cursor.toString()
            },
        };
    }
);

server.registerTool(
    "get-localizacoes",
    {
        description: "Lista as localizações disponíveis para retirada e devolução de veículos na Hermex",
        outputSchema: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                city: z.string(),
                state: z.string(),
            })
        ),
    },
    async () => {
        const localizacoes = await fetch(API_LOCATIONS_URL);
        const localizacoesJson = await localizacoes.json();
        return {
            structuredContent: localizacoesJson,
        };
    }
);

server.registerTool(
    "get-seguros",
    {
        description: "Lista os planos de seguro (proteção) disponíveis para locação na Hermex",
        outputSchema: z.array(
            z.object({
                id: z.string(),
                slug: z.string(),
                name: z.string(),
                pricePerDay: z.number().min(0),
                benefits: z.array(z.string()),
            })
        ),
    },
    async () => {
        const seguros = await fetch(API_PROTECTIONS_URL);
        const segurosJson = await seguros.json();
        return {
            structuredContent: segurosJson,
        };
    }
);

server.registerTool(
    "create-reserva",
    {
        description: "Use essa ferramenta para criar uma reserva",
        inputSchema: z.object({
            carId: z.string().describe("ID do carro a ser reservado"),
            pickupLocationId: z.string().describe("ID da localização de retirada do veículo"),
            returnLocationId: z.string().describe("ID da localização de devolução do veículo"),
            pickupDate: z.iso.date().describe("Data de retirada do veículo (formato ISO: YYYY-MM-DD)"),
            pickupTime: z.iso.time().describe("Horário de retirada do veículo (formato ISO: HH:mm:ss)"),
            returnDate: z.iso.date().describe("Data de devolução do veículo (formato ISO: YYYY-MM-DD)"),
            returnTime: z.iso.time().describe("Horário de devolução do veículo (formato ISO: HH:mm:ss)"),
            protectionId: z.string().describe("ID do plano de seguro (proteção) escolhido"),
        }),
    },
    async (input) => {
        const pedido = await fetch(API_RESERVATIONS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });
        const reservaJson = await pedido.json();
        return {
            structuredContent: reservaJson,
        };
    }
);

server.registerTool(
    "cancel-reserva",
    {
        description: "Use para cancelar uma reserva já confirmada",
        inputSchema: z.object({
            reservationID: z.string().describe("ID da reserva que será cancelada"),
        }),
    },
    async ({ reservationID }) => {
        const pedido = await fetch(`${API_RESERVATIONS_URL}/${reservationID}/cancel`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const resposta = await pedido.json();

        return {
            structuredContent: resposta,
        };
    }
);

server.registerResource(
    "hermex-localidades",
   new ResourceTemplate("file://hermex/localidades/{estado}",
    {
        list:async ()=>(
            {resources: [
                {uri:"file://hermex/localidades/sp",name:"localidade sp"},
                {uri:"file://hermex/localidades/mg",name:"localidade mg"}
            ]
        })

    }),
    {
        title: "localidades Hermex",
        mimeType:"text/json",
        description:"Documento com as localidades da lojas da hermex"
    },
    async (uri,{estado}) => {
        let arquivo;
        if(estado == "sp"){
            arquivo = localidades_sp
        }else if(estado == "mg"){
            arquivo = localidades_mg
        }
        return {
        contents:[
            {
                uri:uri.href,
                mimetype:"text/json",
                text: JSON.stringify(arquivo)
            }
        ]  
       }
    }

)

server.registerPrompt(
    "hermex-reserva-carro",
    {
        title:"Reserva Hermex",
        description:"Reserve um carro na Hermex",
        argsSchema : z.object(
            {
                carro: z.string().describe("ID do carro a ser reservado"),
                local: z.string().describe("ID da localização de retirada do veículo"),
                retirada: z.iso.date().describe("Data de retirada do veículo (formato ISO: YYYY-MM-DD)"),
                devolucao: z.iso.date().describe("Data de devolução do veículo (formato ISO: YYYY-MM-DD)"),
                seguro: z.string().describe("ID do plano de seguro (proteção) escolhido"),
            }
        )
    },
    async ({carro, retirada, devolucao, local, seguro}) => ({
        messages:[
            {
                role:"user",
                content:{
                    type:"text",
                    text:`Verifique se o ${carro} está disponível para retirada na data ${retirada} e devolução em ${devolucao}. Se ele estiver, reserve esse carro para retirada em ${local} com o plano de seguro ${seguro}.`
                }
            },
        ]
    })
)

app.listen(3000, () => {
    console.log("Servidor no ar");
});
