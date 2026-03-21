import { FastifyReply, FastifyRequest } from "fastify";
import { DeleteTransactionParams } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";


export const deleteTransaction = async (
    request: FastifyRequest<{Params: DeleteTransactionParams}>,
    reply: FastifyReply
): Promise<void> => {

     const userId = request.userId
     const { id } = request.params

    if(!userId){
        return reply.status(401).send("Usuário não encontrado");
    
    }
    

    try{
        const transaction = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
            }
        })

        if(!transaction){
            return reply.status(404).send("ID da transação inválido");
        }

        await prisma.transaction.delete({
            where: { id }
        })


        reply.status(200).send("Transação deletada com sucesso");
    }
    catch(error){
        request.log.error("Erro ao deletar transação");
        reply.status(500).send("Erro interno do servidor, falha ao deletar transação");
    }
}