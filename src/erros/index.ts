import { ProtocolError, ProtocolErrorCode } from "@modelcontextprotocol/server";
import { logger } from "../logger";

export class MeuErroCustomizado extends Error {}


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
