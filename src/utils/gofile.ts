import axios from "axios";
import FormData from "form-data";

const CDN_URL = process.env.CDN_URL!;
const CDN_TOKEN = process.env.CDN_TOKEN!;

export async function uploadImageToBucket(buffer: Buffer, filename: string) {
  const form = new FormData();
  form.append("file", buffer, filename);
  form.append("folderId", "invoices");
  try {
    const response = await axios.post(`${CDN_URL}/uploadfile`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${CDN_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error processing invoice:", error);
    throw new Error("Failed to process invoice with Veryfi");
  }
}
