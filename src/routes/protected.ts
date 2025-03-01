import { FastifyInstance } from "fastify";

export async function protectedRoutes(app: FastifyInstance) {
  app.get(
    "/profile",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      return { user: request.user };
    }
  );
}
