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
	origin: [
    "https://spendnote-frontend.xgg4n8.easypanel.host",
    "http://localhost:3001",
  ],
  credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

app.register(routes);

export default app;
