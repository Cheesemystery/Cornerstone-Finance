import { z } from "zod";

const optionalUrl = z.string().url().optional().or(z.literal(""));
const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  PLAID_CLIENT_ID: z.string().optional(),
  PLAID_SECRET: z.string().optional(),
  PLAID_ENV: z.enum(["sandbox", "development", "production"]).default("sandbox"),
  FINNHUB_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  PLAID_TOKEN_ENCRYPTION_KEY: z.string().min(32).optional()
});

export const env = schema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
  PLAID_SECRET: process.env.PLAID_SECRET,
  PLAID_ENV: process.env.PLAID_ENV,
  FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  PLAID_TOKEN_ENCRYPTION_KEY: process.env.PLAID_TOKEN_ENCRYPTION_KEY
});

export const integrations = {
  supabase: Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  plaid: Boolean(env.PLAID_CLIENT_ID && env.PLAID_SECRET && env.PLAID_TOKEN_ENCRYPTION_KEY),
  finnhub: Boolean(env.FINNHUB_API_KEY),
  openai: Boolean(env.OPENAI_API_KEY)
};
