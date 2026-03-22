import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import routes from "./routes";
import { env } from "./config/env";
import cors from "@fastify/cors";

const app: FastifyInstance = Fastify({
	logger: {
		level: env.NODE_ENV === "dev" ? "info" : "error",
	}
});

app.register(cors, {
	origin: true,
  credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

app.options('*', async (request, reply) => {
  reply
    .header('Access-Control-Allow-Origin', request.headers.origin || '*')
    .header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    .header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    .send();
});

app.register(routes, {prefix: "/api"});

export default app;
