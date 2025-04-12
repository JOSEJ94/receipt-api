import { FastifyInstance } from "fastify";
import { processInvoice } from "../utils/veryfi";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { randomInt } from "crypto";
import { uploadBase64Image } from "../utils/firebase";

export async function invoiceRoutes(app: FastifyInstance) {
  app.post(
    "/invoices",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const userId = request.user?.id;
      const { imageBase64 } = request.body as { imageBase64: string };
      const filename = `invoices/${userId}/${Date.now()}.jpg`;
      const imageUrl = await uploadBase64Image(imageBase64, filename);
      console.log("Image URL:", imageUrl);
      console.log("Processing invoice for user:", userId);

      try {
        // Create invoice record in processing state
        const invoice = await prisma.invoice.create({
          data: {
            userId,
            veryfiId: randomInt(0, 999999),
            fileName: "Processing",
            imageThumbnail: "Processing",
            image: "Processing",
            currencyCode: "Unknown",
            invoiceNumber: "Unknown",
            tax: 0,
            subtotal: 0,
            total: 0,
            vendorName: "Unknown",
            vendorCategory: "Unknown",
            vendorLogo: "",
            vendorType: "Unknown",
            currency: "Unknown",
            date: new Date(),
          },
        });
        // 🔥 Procesar imagen con Veryfi
        const veryfiData = await processInvoice(imageUrl);
        const savedInvoice = await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            userId,
            veryfiId: veryfiData.id,
            fileName: veryfiData.img_file_name,
            imageThumbnail: veryfiData.img_thumbnail_url,
            image: veryfiData.img_url,
            currencyCode: veryfiData.currency_code,
            invoiceNumber: veryfiData.invoice_number,
            tax: veryfiData.tax,
            subtotal: veryfiData.subtotal,
            total: veryfiData.total,
            vendorName: veryfiData.vendor?.name,
            vendorCategory: veryfiData.vendor?.category,
            vendorLogo: veryfiData.vendor?.logo,
            vendorType: veryfiData.vendor?.type,
            currency: veryfiData.currency_code || "USD",
            date: new Date(veryfiData.date || Date.now()),
            status: "PROCESSED",
          },
        });

        return reply.status(201).send(savedInvoice);
      } catch (error) {
        return reply.status(500).send({ error: "Failed to process invoice" });
      }
    }
  );

  app.get(
    "/invoices",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      try {
        const userId = request.user.id;

        const invoices = await prisma.invoice.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });

        return reply.send(invoices);
      } catch (error) {
        return reply.status(500).send({ error: "Failed to get invoices" });
      }
    }
  );

  app.get(
    "/invoices/:id",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const userId = request.user.id;

        const invoice = await prisma.invoice.findUnique({
          where: { id, userId },
        });

        if (!invoice) {
          return reply.status(404).send({ error: "Receipt not fount" });
        }

        return reply.send(invoice);
      } catch (error) {
        return reply
          .status(500)
          .send({ error: "Error obtaining this receipt" });
      }
    }
  );

  app.delete(
    "/invoices/:id",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const userId = request.user.id;

        const invoice = await prisma.invoice.findUnique({
          where: { id, userId },
        });

        if (!invoice) {
          return reply.status(404).send({ error: "Receipt not found" });
        }

        await prisma.invoice.delete({ where: { id } });

        return reply.send({ message: "Receipt deleted successfully" });
      } catch (error) {
        return reply.status(500).send({ error: "Error deleting this receipt" });
      }
    }
  );

  app.put(
    "/invoices/:id",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const userId = request.user.id;

        const invoiceSchema = z.object({
          vendor: z.string().optional(),
          total: z.number().optional(),
          currency: z.string().optional(),
          date: z.string().optional(),
        });

        const body = invoiceSchema.parse(request.body);

        const invoice = await prisma.invoice.findUnique({
          where: { id, userId },
        });

        if (!invoice) {
          return reply.status(404).send({ error: "Receipt not found" });
        }

        const updatedInvoice = await prisma.invoice.update({
          where: { id },
          data: body,
        });

        return reply.send(updatedInvoice);
      } catch (error) {
        return reply
          .status(400)
          .send({ error: "Error updating this receipt", details: error });
      }
    }
  );
}
