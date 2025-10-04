import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";

// Use relative URL for server-side to avoid self-calling over HTTP
// Use full URL for client-side
const getBaseUrl = () => {
  // Client-side: use the full URL from env
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL!;
  }
  
  // Server-side: use relative URL or Vercel URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback to env variable
  return process.env.NEXT_PUBLIC_APP_URL!;
};

export const client = hc<AppType>(getBaseUrl());