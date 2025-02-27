import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth";
import { protectedRoutes } from "./routes/protected";
import { authPlugin } from "./plugins/auth";

dotenv.config();

const app = Fastify({ logger: true });

// Plugins
app.register(cors);
app.register(jwt, { secret: process.env.JWT_SECRET || "supersecret" });

app.register(authRoutes);
app.decorate(
  "authenticate",
  async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  }
);

// app.register(authPlugin);
app.register(protectedRoutes);

app.get("/", async () => {
  return { message: "API is running!" };
});

// Iniciar el servidor
const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("🚀 Server running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
