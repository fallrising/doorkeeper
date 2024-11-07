import { Application } from 'https://deno.land/x/oak@v17.1.3/mod.ts';
import router from './routes/routes.ts';
import { performHealthCheck } from './services/healthCheckService.ts';
import { authMiddleware } from './utils/authMiddleware.ts';

const app = new Application();

app.use(authMiddleware); // Apply before other routes
app.use(router.routes());
app.use(router.allowedMethods());

performHealthCheck();

await app.listen({ port: 8000 });
