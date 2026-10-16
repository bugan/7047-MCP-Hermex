import { createMcpServer } from "./src/create-server";
import { createHttpApp } from "./src/http";
import { logger } from "./src/logger";

const server = createMcpServer();
const app = createHttpApp(server);

app.listen(3000, () => {
    logger.info("Servidor no ar");
});
