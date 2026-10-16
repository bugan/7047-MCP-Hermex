import { ProtocolError, ProtocolErrorCode } from "@modelcontextprotocol/server";
import pino from "pino"
export class MeuErroCustomizado extends Error {}

const logger = pino();
export function ferramentaComTratamento(callback: any) {
    return async (input: any) => {
        try {
            return await callback(input);
        } catch (erro) {
            logger.info("Erro encontrado")
            if (!(erro instanceof MeuErroCustomizado)) {
                logger.fatal(erro.message)
                throw new ProtocolError(ProtocolErrorCode.InternalError, "Erro interno do Servidor dentro do Decorator");
            } else {
                logger.error(erro.message)
                throw erro;
            }
        }
    };
}
