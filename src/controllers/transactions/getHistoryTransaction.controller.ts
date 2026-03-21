import { FastifyReply, FastifyRequest } from "fastify";
import { GetHistoryTransactionQuery } from "../../schemas/transaction.schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";
import "dayjs/locale/pt-br";


dayjs.locale("pt-br");
dayjs.extend(utc);


export const getHistoryTransaction = async (
    request:FastifyRequest<{Querystring: GetHistoryTransactionQuery }>,
    reply:FastifyReply
):Promise<void> => {

    const userId = request.userId;

    if(!userId){
        return reply.status(401).send("Usuário não encontrado");
    
    }

    const { month, year, months = 6 } = request.query;

    const baseDate = new Date(year, month - 1, 1);

    const startDate = dayjs.utc(baseDate).subtract(months -1, "month").startOf("month").toDate();
    const endDate = dayjs.utc(baseDate).endOf("month").toDate();

    try {

        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                }
            }, select: {
                amount: true,
                type: true,
                date: true,
            },
        });
        const montlhyData = Array.from({ length: months }, (_, i) => {
            const date = dayjs.utc(baseDate).subtract(months -1 -i, "month")
            return {
                name: date.format("MMM/YYYY"),
                incomes:0,
                expenses:0,
            }
        });
        
        transactions.forEach(transaction => {
            const monthKey = dayjs.utc(transaction.date).format("MMM/YYYY");
            const monthData = montlhyData.find( m => m.name === monthKey);

            if(monthData){
                if(transaction.type === "income"){
                    monthData.incomes += transaction.amount;
                }else{
                    monthData.expenses += transaction.amount;
                }
            } 

        });
        return reply.send({history: montlhyData});

    } catch (error) {
        request.log.error("Erro ao buscar transações");
        return reply.status(500).send("Erro ao buscar transações");
    }

};