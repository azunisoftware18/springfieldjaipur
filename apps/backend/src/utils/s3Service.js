import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import crypto from "crypto";

// ================= S3 CLIENT =================
const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

// ================= CONSTANTS =================
const MAIN_FOLDER = "ticket-booking";
const bucket = process.env.S3_BUCKET;

// ================= VALIDATION =================
if (!bucket) {
  throw new Error("S3 bucket not configured");
}

function generateUniqueName(extension) {
  return `${Date.now()}_${crypto.randomUUID()}${extension}`;
}

function buildS3Key(uniqueName) {
  return `${MAIN_FOLDER}/${uniqueName}`;
}

// ================= UPLOAD FUNCTION =================
async function upload(localFilePath) {
  if (!localFilePath) {
    throw new Error("File path is required");
  }

  const fileStream = fs.createReadStream(localFilePath);
  const ext = path.extname(localFilePath);
  const mimeType = mime.lookup(localFilePath) || "application/octet-stream";

  const uniqueName = generateUniqueName(ext);
  const s3Key = buildS3Key(uniqueName);

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key,
        Body: fileStream,
        ContentType: mimeType,
        ACL: "private",
      }),
    );

    return {
      key: s3Key,
      url: buildS3Url(s3Key),
    };
  } finally {
    // cleanup local file (always)
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
}

// ================= DELETE FUNCTION =================
async function deleteByKey(s3Key) {
  if (!s3Key) {
    throw new Error("S3 key is required");
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: s3Key,
    }),
  );

  return true;
}

// ================= GET SIGNED URL =================
async function getSignedFileUrl(s3Key, expiresIn = 86400) {
  if (!s3Key) {
    throw new Error("S3 key is required");
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: s3Key,
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Failed to generate signed URL");
  }
}

// ================= HELPER FUNCTIONS =================
function buildS3Url(key) {
  if (!key) return null;
  return `https://${bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
}

function extractKeyFromUrl(fileUrl) {
  if (!fileUrl) return null;
  return fileUrl.split(".amazonaws.com/")[1] || null;
}

export { upload, deleteByKey, buildS3Url, extractKeyFromUrl, getSignedFileUrl };