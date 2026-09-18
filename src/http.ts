import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import type { McpServer } from "@modelcontextprotocol/server";
import type { Request, Response } from "express";

export function createHttpApp(server: McpServer) {
    const app = createMcpExpressApp();

    app.all("/mcp", async (req: Request, res: Response) => {
        const transport = new NodeStreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        await server.connect(transport);

        // If you use Express JSON parsing, pass the pre-parsed body to avoid re-reading the stream.
        await transport.handleRequest(req, res, req.body);
    });

    return app;
}
