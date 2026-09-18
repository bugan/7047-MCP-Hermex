import { z } from "zod";

export const createReservaInputSchema = z.object({
    carId: z.string().describe("ID do carro a ser reservado"),
    pickupLocationId: z.string().describe("ID da localização de retirada do veículo"),
    returnLocationId: z.string().describe("ID da localização de devolução do veículo"),
    pickupDate: z.iso.date().describe("Data de retirada do veículo (formato ISO: YYYY-MM-DD)"),
    pickupTime: z.iso.time().describe("Horário de retirada do veículo (formato ISO: HH:mm:ss)"),
    returnDate: z.iso.date().describe("Data de devolução do veículo (formato ISO: YYYY-MM-DD)"),
    returnTime: z.iso.time().describe("Horário de devolução do veículo (formato ISO: HH:mm:ss)"),
    protectionId: z.string().describe("ID do plano de seguro (proteção) escolhido"),
});

export const cancelReservaInputSchema = z.object({
    reservationID: z.string().describe("ID da reserva que será cancelada"),
});

export const hermexReservaCarroArgsSchema = z.object({
    carro: z.string().describe("ID do carro a ser reservado"),
    local: z.string().describe("ID da localização de retirada do veículo"),
    retirada: z.iso.date().describe("Data de retirada do veículo (formato ISO: YYYY-MM-DD)"),
    devolucao: z.iso.date().describe("Data de devolução do veículo (formato ISO: YYYY-MM-DD)"),
    seguro: z.string().describe("ID do plano de seguro (proteção) escolhido"),
});
