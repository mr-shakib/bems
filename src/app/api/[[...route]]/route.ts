import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';

import auth from '@/features/auth/server/route';
import workspaces from '@/features/workspaces/server/route';

const app = new Hono().basePath("/api");

app.use('*', cors({
  origin: (origin) => {
    // Allow requests from localhost on any port during development
    if (!origin || origin.startsWith('http://localhost:')) {
      return origin;
    }
    // Add your production domain here when deploying
    return null;
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

const routes = app
  .route("/auth", auth)
  .route("/workspaces", workspaces);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);

export type AppType =  typeof routes;