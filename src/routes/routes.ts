import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { registerService } from "../controllers/registerController.ts";
import { unregisterService } from "../controllers/unregisterController.ts";
import { getAllHealthStatus, getHealthStatus } from "../controllers/healthController.ts";
import { getServicesByTag } from "../controllers/tagController.ts";
import { getServiceByKeyController } from '../controllers/dataController.ts';
import { purgeAllServices, enableService, disableService } from '../controllers/adminController.ts';

const router = new Router();

// Existing routes
router.put("/v1/agent/service/register", registerService);
router.put("/v1/agent/service/deregister/:service_id", unregisterService);
router.get("/v1/health/service/:service_name", getHealthStatus);
router.get("/v1/health/tag/:tag", getServicesByTag);
router.get("/v1/health/service", getAllHealthStatus);
router.get("/v1/service/:service_id", getServiceByKeyController);

// New admin routes
router.post("/v1/admin/purge", purgeAllServices);
router.post("/v1/admin/service/:service_id/enable", enableService);
router.post("/v1/admin/service/:service_id/disable", disableService);

export default router;