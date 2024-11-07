// src/utils/authMiddleware.ts
import { Context } from 'https://deno.land/x/oak@v17.1.3/mod.ts';

export async function authMiddleware(
  context: Context,
  next: () => Promise<unknown>,
) {
  const authHeader = context.request.headers.get('Authorization');
  const AUTH_TOKEN = Deno.env.get('AUTH_TOKEN') || 'your-secret-token';

  if (authHeader === `Bearer ${AUTH_TOKEN}`) {
    await next();
  } else {
    context.response.status = 401;
    context.response.body = { error: 'Unauthorized' };
  }
}
