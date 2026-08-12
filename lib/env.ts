const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

const enforceProduction =
  process.env.NODE_ENV === "production" && !isBuildTime;

const INSECURE_JWT_SECRETS = new Set([
  "",
  "change-me-to-a-random-string",
  "dev-secret-change-in-production",
  "fallback-secret-change-in-production",
]);

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (enforceProduction && (!value || value.trim() === "")) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        "Set it in your environment or .env file before deploying."
    );
  }
  return value ?? "";
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET ?? "";
  if (enforceProduction && INSECURE_JWT_SECRETS.has(secret)) {
    throw new Error(
      "JWT_SECRET must be set to a strong, unique random string in production. " +
        "Generate one with: openssl rand -base64 48"
    );
  }
  return secret || "dev-only-insecure-secret";
}

export function getDatabaseConfig(): { url: string; authToken?: string } {
  const url = process.env.TURSO_DATABASE_URL;
  if (enforceProduction && !url) {
    throw new Error(
      "Missing required environment variable: TURSO_DATABASE_URL. " +
        "Create a Turso database and copy its libsql:// URL."
    );
  }
  return {
    url: url || "file:./local.db",
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  };
}

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl?: string;
  endpoint: string;
}

export function getR2Config(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID ?? "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
  const bucketName = process.env.R2_BUCKET_NAME ?? "";
  if (
    enforceProduction &&
    (!accountId || !accessKeyId || !secretAccessKey || !bucketName)
  ) {
    throw new Error(
      "Missing required environment variable(s): R2_ACCOUNT_ID, " +
        "R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME. " +
        "Create an R2 bucket and generate an access key in Cloudflare."
    );
  }
  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl: process.env.R2_PUBLIC_URL?.replace(/\/+$/, "") || undefined,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  };
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://arniphotography.in").replace(/\/+$/, "");
}
