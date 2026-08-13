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
    () => {
        return {
            content:[
                {type:"text", text:"C4 Cactus"},
                {type:"text", text:"Honda Civic"},
                {type:"text", text:"BYD "}
            ]
        }
    }
)







app.listen(3000,()=>{
    console.log("Servidor no ar")
});