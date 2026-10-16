import { ProtocolError, ProtocolErrorCode } from "@modelcontextprotocol/server";

export class MeuErroCustomizado extends Error {}

export function ferramentaComTratamento(callback: any) {
    return async (input: any) => {
        try {
            return await callback(input);
        } catch (erro) {
            if (!(erro instanceof MeuErroCustomizado)) {
                console.log(erro);
                throw new ProtocolError(ProtocolErrorCode.InternalError, "Erro interno do Servidor dentro do Decorator");
            } else {
                throw erro;
            }
        }
    };
}
