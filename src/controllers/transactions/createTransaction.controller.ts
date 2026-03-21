import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTransactionBody, createTransactionSchema } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";



const createTransaction = async(
    request:FastifyRequest<{Body: CreateTransactionBody}>,
    reply:FastifyReply
): Promise<void> => {

    const userId = request.userId;

    if(!userId){
        return reply.status(401).send("Usuário não encontrado");
    
    }

    const result = createTransactionSchema.safeParse(request.body);

    if(!result.success){
        const errorMessage = result.error.issues[0].message || "Validação inválida";

        return reply.status(400).send({message: errorMessage});
    }
 
    const transaction = result.data;

    try{
        const category = await prisma.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type,
            },
        });

        if(!category){
            return reply.status(400).send({error: "Categoria inválida"});
        };
        

        const parseDate = new Date(transaction.date);
        const newTransaction = await prisma.transaction.create({
            data: {
                ...transaction,
                userId: userId,
                date: parseDate,
            },
            include: {
                category: true,
            }
        });
        reply.status(201).send(newTransaction);
    }catch(error){
        request.log.error("Erro ao criar transação");
        reply.status(500).send("Erro ao criar transação");
    }
}

export default createTransaction