import { FastifyInstance } from "fastify";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { getTransaction } from "../controllers/transactions/getTransaction.controller";
import { getTransactionSummary } from "../controllers/transactions/getTransactionSummary.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { getHistoryTransaction } from "../controllers/transactions/getHistoryTransaction.controller";


const transactionRoutes = async(fastify: FastifyInstance): Promise<void> => {

    fastify.addHook("preHandler", authMiddleware);


    // criação
    fastify.route({
        method: "POST",
        url: "/",
        schema: {
            body: {
                type: "object",
                required: ["description", "amount", "date", "categoryId", "type"],
                properties: {
                    description: { type: "string" },
                    amount: { type: "number" },
                    date: { type: "string", format: "date-time" },
                    categoryId: { type: "string" },
                    type: { type: "string", enum: ["expense", "income"] },
                },
            },

        },
        handler: createTransaction,
    });


    //buscar com filtros
    fastify.route({
        method: "GET",
        url: "/",
        schema: {
            querystring: {
                type: "object",
                properties: {
                    month: { type: "string" },
                    year: { type: "string" },
                    categoryId: { type: "string" },
                    type: { type: "string", enum: ["expense", "income"] },
                }
            }
        },
        handler: getTransaction,
});

    //buscar o resumo
    fastify.route({
        method: "GET",
        url: "/summary",
        schema: {
            querystring: {
                type: "object",
                required: ["month", "year"],
                properties: {
                    month: { type: "string" },
                    year: { type: "string" },
                }
            }
        },
        handler: getTransactionSummary,
});

    //Histórico de Transações
    fastify.route({
            method: "GET",
            url: "/history",
            schema: {
                querystring: {
                    type: "object",
                    required: ["month", "year"],
                    properties: {
                        month: { type: "string" },
                        year: { type: "string" },
                        months: { type: "string" },
                    }
                }
            },
            handler: getHistoryTransaction,
});

    // deletar
    fastify.route({
        method: "DELETE",
        url: "/:id",
        schema: {
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string" },
                }
            }
        },
         handler: deleteTransaction,
    });

}

export default transactionRoutes