import { McpServer } from "@modelcontextprotocol/server";
import { registerCars } from "./cars";
import { registerLocations } from "./locations";
import { registerProtections } from "./protections";
import { registerReservations } from "./reservations";

export function createMcpServer() {
    const server = new McpServer(
        { name: "hermex-server", version: "1.0.0" },
        {
            capabilities: {
                resources: { listChanged: true },
                prompts: { listChanged: true },
            },
        }
    );

    registerCars(server);
    registerLocations(server);
    registerProtections(server);
    registerReservations(server);

    return server;
}
