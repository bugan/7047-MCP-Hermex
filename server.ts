import { createMcpServer } from "./src/create-server";
import { createHttpApp } from "./src/http";

const server = createMcpServer();
const app = createHttpApp(server);

app.listen(3000, () => {
    console.log("Servidor no ar");
});
