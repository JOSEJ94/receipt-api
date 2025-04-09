import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const { email, username, password } = request.body as {
      email: string;
      username: string;
      password: string;
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: { email, username, password: hashedPassword },
      });
      const token = app.jwt.sign({ id: user.id, email: user.email });

      return reply
        .status(201)
        .send({
          token,
          id: user.id,
          username: user.username,
          email: user.email,
        });
    } catch (error) {
      return reply.status(400).send({ error: "User already exists" });
    }
  });

  app.post("/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = app.jwt.sign({ id: user.id, email: user.email });

    return { token };
  });
}
