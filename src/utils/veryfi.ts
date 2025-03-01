import axios from "axios";

const VERYFI_URL = "https://api.veryfi.com/api/v8/partner/documents";
const CLIENT_ID = process.env.VERYFI_CLIENT_ID!;
const USERNAME = process.env.VERYFI_USERNAME!;
const API_KEY = process.env.VERYFI_API_KEY!;

export async function processInvoice(imageUrl: string) {
  try {
    const response = await axios.post(
      VERYFI_URL,
      {
        file_url: imageUrl,
        auto_delete: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "CLIENT-ID": CLIENT_ID,
          AUTHORIZATION: `apikey ${USERNAME}:${API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing invoice:", error);
    throw new Error("Failed to process invoice with Veryfi");
  }
}
