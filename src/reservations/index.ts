import type { McpServer } from "@modelcontextprotocol/server";
import { API_RESERVATIONS_URL } from "../config";
import { ferramentaComTratamento } from "../erros";
import {
    cancelReservaInputSchema,
    createReservaInputSchema,
    hermexReservaCarroArgsSchema,
} from "./schemas";

export function registerReservations(server: McpServer) {
    server.registerTool(
        "create-reserva",
        {
            description: "Use essa ferramenta para criar uma reserva",
            inputSchema: createReservaInputSchema,
        },
        ferramentaComTratamento(async (input) => {
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
        })
    );

    server.registerTool(
        "cancel-reserva",
        {
            description: "Use para cancelar uma reserva já confirmada",
            inputSchema: cancelReservaInputSchema,
        },
        ferramentaComTratamento(async ({ reservationID }) => {
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
        })
    );

    server.registerPrompt(
        "hermex-reserva-carro",
        {
            title: "Reserva Hermex",
            description: "Reserve um carro na Hermex",
            argsSchema: hermexReservaCarroArgsSchema,
        },
        async ({ carro, retirada, devolucao, local, seguro }) => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Verifique se o ${carro} está disponível para retirada na data ${retirada} e devolução em ${devolucao}. Se ele estiver, reserve esse carro para retirada em ${local} com o plano de seguro ${seguro}.`,
                    },
                },
            ],
        })
    );
}
