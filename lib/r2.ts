import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Config } from "@/lib/env";

let cachedClient: S3Client | null = null;

function getS3Client(): S3Client {
  if (cachedClient) return cachedClient;
  const { endpoint, accessKeyId, secretAccessKey } = getR2Config();
  cachedClient = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  return cachedClient;
}

export function getR2PublicUrl(): string {
  const { publicUrl } = getR2Config();
  if (!publicUrl) {
    throw new Error(
      "R2_PUBLIC_URL is not configured. Set it to your R2 custom domain " +
        "(e.g. https://media.example.com) so uploads can be served."
    );
  }
  return publicUrl;
}

export function publicKeyToUrl(key: string): string {
  return `${getR2PublicUrl()}/${key}`;
}

export function isR2Url(url: string): boolean {
  const { publicUrl } = getR2Config();
  return !!publicUrl && url.startsWith(publicUrl);
}

export function keyFromR2Url(url: string): string | null {
  const { publicUrl } = getR2Config();
  if (!publicUrl || !url.startsWith(publicUrl)) return null;
  return url.slice(publicUrl.length).replace(/^\//, "");
}

export async function createPresignedUploadUrl(params: {
  key: string;
  contentType: string;
  expiresIn?: number;
}): Promise<string> {
  const { bucketName } = getR2Config();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: params.key,
    ContentType: params.contentType,
  });
  return getSignedUrl(getS3Client(), command, {
    expiresIn: params.expiresIn ?? 900,
  });
}

export async function deleteR2Object(key: string): Promise<void> {
  if (!key) return;
  try {
    const { bucketName } = getR2Config();
    await getS3Client().send(
      new DeleteObjectCommand({ Bucket: bucketName, Key: key })
    );
  } catch {
    // Deleting an object that no longer exists is harmless. Never
    // let a failed storage cleanup take down the API response.
  }
}

export async function deleteR2ObjectByUrl(url: string): Promise<void> {
  const key = keyFromR2Url(url);
  if (!key) return;
  await deleteR2Object(key);
}
