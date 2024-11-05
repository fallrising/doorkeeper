import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { registerService } from "../controllers/registerController.ts";
import { unregisterService } from "../controllers/unregisterController.ts";
import { getHealthStatus } from "../controllers/healthController.ts";
import { getServicesByTag } from "../controllers/tagController.ts"; // New import

const router = new Router();

router.put("/v1/agent/service/register", registerService);
router.put("/v1/agent/service/deregister/:service_id", unregisterService);
router.get("/v1/health/service/:service_name", getHealthStatus);
router.get("/v1/health/tag/:tag", getServicesByTag); // New route

export default router;
