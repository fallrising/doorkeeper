import { Router } from "https://deno.land/x/oak/mod.ts";
import { registerService } from "../controllers/registerController.ts";
import { unregisterService } from "../controllers/unregisterController.ts";
import { getHealthStatus } from "../controllers/healthController.ts";

const router = new Router();

router.put("/v1/agent/service/register", registerService);
router.put("/v1/agent/service/deregister/:service_id", unregisterService);
router.get("/v1/health/service/:service_name", getHealthStatus);

export default router;
