import { z } from "zod";

// --- WEB ENVIRONMENT ---
const webPublicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

const webPrivateSchema = z.object({
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
});

export function validateWebEnv() {
  const publicEnv = webPublicSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  const privateEnv = webPrivateSchema.safeParse({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  });

  if (!publicEnv.success || !privateEnv.success) {
    console.error("❌ Invalid Web Environment Variables:");
    if (!publicEnv.success) console.error(publicEnv.error.format());
    if (!privateEnv.success) console.error(privateEnv.error.format());
    throw new Error("Missing or invalid environment variables. Aborting.");
  }

  return {
    public: publicEnv.data,
    private: privateEnv.data,
  };
}

// --- API ENVIRONMENT ---
const apiSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  CORS_ORIGIN: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export function validateApiEnv() {
  const env = apiSchema.safeParse(process.env);

  if (!env.success) {
    console.error("❌ Invalid API Environment Variables:");
    console.error(env.error.format());
    throw new Error("Missing or invalid API environment variables. Aborting.");
  }

  return env.data;
}
