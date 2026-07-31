const isBuildTime = !process.env.NEXT_RUNTIME;

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

export function getCloudinaryConfig(): {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
} {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? "";
  const apiKey = process.env.CLOUDINARY_API_KEY ?? "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET ?? "";
  if (enforceProduction && (!cloudName || !apiKey || !apiSecret)) {
    throw new Error(
      "Missing required environment variable(s): CLOUDINARY_CLOUD_NAME, " +
        "CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET. Add your Cloudinary credentials."
    );
  }
  return { cloudName, apiKey, apiSecret };
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://arniphotography.in").replace(/\/+$/, "");
}
