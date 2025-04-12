import { randomUUID } from "crypto";
import admin from "firebase-admin";

const serviceAccount = require("../../receipt-spark-service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://receipt-spark.firebasestorage.app",
  });
}
const bucket = admin.storage().bucket();

export { bucket };

export const uploadBase64Image = async (
  base64: string,
  filename: string
): Promise<string> => {
  const buffer = Buffer.from(base64, "base64");

  const file = bucket.file(filename);
  const uuid = randomUUID();

  await file.save(buffer, {
    metadata: {
      contentType: "image/jpeg",
      metadata: {
        firebaseStorageDownloadTokens: uuid,
      },
    },
    public: true,
  });

  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${
    bucket.name
  }/o/${encodeURIComponent(filename)}?alt=media&token=${uuid}`;
  return downloadUrl;
};
