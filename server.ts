import { McpServer } from "@modelcontextprotocol/server";
import { createMcpExpressApp} from '@modelcontextprotocol/express'
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";

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
    description:"Busca a lista de carros disponiveis para locação na Hermex"
    },
    async () => {

       const carros = await fetch("http://localhost:3333/api/cars")
        const carrosJson = await carros.json();
        console.log(carrosJson);
        return {
            structuredContent:carrosJson
            
        }
    }
)







app.listen(3000,()=>{
    console.log("Servidor no ar")
});