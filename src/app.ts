import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./routes/routes.ts";
import { performHealthCheck } from "./services/healthCheckService.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

performHealthCheck();

await app.listen({ port: 8000 });
