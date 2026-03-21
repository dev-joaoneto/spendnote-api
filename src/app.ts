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
    "http://localhost:5175",
    "https://spendnote-frontend.xgg4n8.easypanel.host"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflight: true
});

app.options("/*", async (request, reply) => {
  reply.send();
});

app.register(routes, {prefix: "/api"});

export default app;
