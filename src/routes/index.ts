import type { FastifyInstance } from "fastify";
import categoryRoutes from "./category.routes";
import transactionRoutes from "./transaction.routes";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";


async function routes(fastify: FastifyInstance): Promise<void> {
	fastify.get("/health", async () => {
		return {
			status: "ok",
			message: "rondando ok",
		};
	});

	fastify.register(categoryRoutes, { prefix: "/categories" });
	fastify.register(transactionRoutes, { prefix: "/transactions" });
}

export default routes;
