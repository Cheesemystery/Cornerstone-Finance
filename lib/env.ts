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
  PLAID_TOKEN_ENCRYPTION_KEY: z.string().min(32).optional(),
  PLAID_WEBHOOK_URL: optionalUrl,
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_ANNUAL_PRICE_ID: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RECAP_EMAIL_FROM: z.string().email().optional().or(z.literal("")),
  RECAP_SIGNING_SECRET: z.string().min(32).optional(),
  CRON_SECRET: z.string().min(20).optional(),
  APP_URL: optionalUrl,
  CAMPUS_DOMAIN_ALLOWLIST: z.string().optional()
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
  PLAID_TOKEN_ENCRYPTION_KEY: process.env.PLAID_TOKEN_ENCRYPTION_KEY,
  PLAID_WEBHOOK_URL: process.env.PLAID_WEBHOOK_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_MONTHLY_PRICE_ID,
  STRIPE_ANNUAL_PRICE_ID: process.env.STRIPE_ANNUAL_PRICE_ID,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RECAP_EMAIL_FROM: process.env.RECAP_EMAIL_FROM,
  RECAP_SIGNING_SECRET: process.env.RECAP_SIGNING_SECRET,
  CRON_SECRET: process.env.CRON_SECRET,
  APP_URL: process.env.APP_URL,
  CAMPUS_DOMAIN_ALLOWLIST: process.env.CAMPUS_DOMAIN_ALLOWLIST
});

export const integrations = {
  supabase: Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  plaid: Boolean(env.PLAID_CLIENT_ID && env.PLAID_SECRET && env.PLAID_TOKEN_ENCRYPTION_KEY),
  finnhub: Boolean(env.FINNHUB_API_KEY),
  openai: Boolean(env.OPENAI_API_KEY),
  supabaseAdmin:Boolean(env.NEXT_PUBLIC_SUPABASE_URL&&env.SUPABASE_SERVICE_ROLE_KEY),
  stripe:Boolean(env.STRIPE_SECRET_KEY&&env.STRIPE_WEBHOOK_SECRET&&env.STRIPE_MONTHLY_PRICE_ID&&env.STRIPE_ANNUAL_PRICE_ID),
  resend:Boolean(env.RESEND_API_KEY&&env.RECAP_EMAIL_FROM&&env.RECAP_SIGNING_SECRET)
};
