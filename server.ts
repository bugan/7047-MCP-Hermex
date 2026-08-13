import { McpServer } from "@modelcontextprotocol/server";
import { createMcpExpressApp} from '@modelcontextprotocol/express'
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import {z} from "zod"
const server = new McpServer({ name: 'hermex-server', version: '1.0.0' });
const app = createMcpExpressApp();

app.post('/mcp', async (req: Request, res: Response) => {
    const transport = new NodeStreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);

    // If you use Express JSON parsing, pass the pre-parsed body to avoid re-reading the stream.
    await transport.handleRequest(req, res, req.body);
});



server.registerTool(
    "get-carros-disponiveis",
    {
        description:"Busca a lista de carros disponiveis para locação na Hermex",
        inputSchema:z.object(
            {
                categoria:z.string().optional().default("").describe("filtro da lista de carros"),
            }
        ),
        outputSchema: z.array(
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
            })
        )
    },
    async (input) => {
        
       const carros = await fetch(`http://localhost:3333/api/cars?category=${input.categoria}`)
        const carrosJson = await carros.json();
        return {
            structuredContent:carrosJson
            
        }
    }
)

server.registerTool(
    "create-reserva",
    {
        description:"Use essa ferramenta para criar uma reserva",
        inputSchema: z.object({
            
                carId: z.string(),
                pickupLocationId: z.string(),
                returnLocationId: z.string(),
                pickupDate: z.iso.date(),
                pickupTime: z.iso.time(),
                returnDate: z.iso.date(),
                returnTime: z.iso.time(),
                protectionId: z.string()
              
        })
    },
    async (input) => {

        console.log(JSON.stringify(input))
        const url ="http://localhost:3333/api/reservations"
        const pedido = await fetch(url, {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
        })
        const reservaJson = await pedido.json();
        console.log(reservaJson)
        return {
            structuredContent:reservaJson
        }
    }
)

server.registerTool(
    "cancel-reserva",
    {
        description:"Use para cancelar uma reserva já confirmada",
        inputSchema:z.object({
            reservationID: z.string()
        })
    },
    async ({reservationID}) => {
        const pedido = await fetch(
            `http://localhost:3333/api/reservations/${reservationID}/cancel`,
            {
                method:"PATCH",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        const resposta = await pedido.json();

        return{
            structuredContent:resposta
        }
    }
    
)



app.listen(3000,()=>{
    console.log("Servidor no ar")
});