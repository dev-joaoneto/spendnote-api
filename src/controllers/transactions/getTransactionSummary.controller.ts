import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { FastifyReply, FastifyRequest } from "fastify";
import { GetTransactionSummaryQuery } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";
import { CategorySummary } from "../../types/category.types";
import { TransactionType } from "@prisma/client";
import { TransactionSummary } from "../../types/transaction.type";

dayjs.extend(utc);

export const getTransactionSummary = async (
    request:FastifyRequest<{Querystring: GetTransactionSummaryQuery }>,
    reply:FastifyReply): Promise<void> => {

    const userId = request.userId

    if(!userId){
        return reply.status(401).send("Usuário não encontrado");
    }
    
    const { month, year } = request.query

    if(!month || !year){
        return reply.status(400).send("O mês e o ano é obrigatório");
    }

    const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = dayjs.utc(startDate).endOf("month").toDate();

    try{
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            include: {
                category: true
            }
        });

        let totalExpenses = 0;
        let totalIncomes = 0;
        const groupedExpenses = new Map<string, CategorySummary>(); 

        for(const transaction of transactions){
            if(transaction.type === TransactionType.expense){

                const existing = groupedExpenses.get(transaction.categoryId) ?? {
                    categoryId: transaction.categoryId,
                    categoryName: transaction.category.name,
                    categoryColor: transaction.category.color,
                    amount: 0,
                    percentage: 0,
                };
                
                existing.amount += transaction.amount;
                groupedExpenses.set(transaction.categoryId, existing);

                totalExpenses += transaction.amount;   
            } else {
                totalIncomes += transaction.amount;
            }
        }

        const summary: TransactionSummary = {
            totalExpenses,
            totalIncomes,
            balance: Number((totalIncomes - totalExpenses).toFixed(2)),
            expensesByCategory: Array.from(groupedExpenses.values()).map((entry) => ({
                ...entry,
                percentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2)),
            })).sort((a, b) => b.amount - a.amount),
        };
        

        reply.send(summary);
    }
    catch(error){
        request.log.error("Erro ao buscar transações");
        reply.status(500).send("Erro do servidor");

    }
}