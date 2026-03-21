import { z } from "zod";
import { ObjectId } from "mongodb";
import { TransactionType } from "@prisma/client";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
    description: z.string().min(3, "Descição obrigatória"),
    amount: z.number().positive("O Valor deve ser positivo"),
    date: z.coerce.date({
        error: () => ({ message: "Data inválida" })
    }),
    categoryId: z.string().refine(isValidObjectId, { 
        message: "Categoria inválida",
    }),
    type: z.enum([TransactionType.expense, TransactionType.income], {
        error: () => ({ message: "Data inválida" })
    })
});

export const getTransactionSchema = z.object({
    month: z.string().optional(),
    year: z.string().optional(),
    type: z.enum([TransactionType.expense, TransactionType.income], {
        error: () => ({ message: "Data inválida" })
    })
    .optional(),
    categoryId: z.string().refine(isValidObjectId, { 
        message: "Categoria inválida",
    })
    .optional()
});

export const getTransactionSummarySchema = z.object({
    month: z.string({message: "O mês é obrigatório"}),
    year: z.string({message: "O ano é obrigatório"}),
});

export const getHistoryTransactionSchema = z.object({
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000).max(2100),
    months: z.coerce.number().min(1).max(12).optional(),
});

export const deleteTransactionSchema = z.object({
    id: z.string().refine(isValidObjectId, { 
        message: "ID inválido",
    })
});

export type GetTransactionQuery = z.infer<typeof getTransactionSchema>;
export type CreateTransactionBody = z.infer<typeof createTransactionSchema>;
export type GetTransactionSummaryQuery = z.infer<typeof getTransactionSummarySchema>;
export type GetHistoryTransactionQuery = z.infer<typeof getHistoryTransactionSchema>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;
