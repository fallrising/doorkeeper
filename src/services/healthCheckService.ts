import { HEALTH_CHECK_INTERVAL } from "../config.ts";
import { log } from "../utils/logger.ts";
import {getAllServices} from "./dataService.ts";

export async function performHealthCheck() {
  while (true) {
    const healthChecks = Object.entries(getAllServices()).map(async ([id, service]) => {
      try {
        if (service.checkType === "http") {
          const response = await fetch(service.checkURL);
          service.status = response.ok ? "healthy" : "unhealthy";
        } else {
          service.status = "unimplemented check type";
        }
      } catch {
        service.status = "unhealthy";
      } finally {
        service.lastChecked = new Date();
        log(`Checked service ${id}: ${service.status}`);
      }
    });

    await Promise.all(healthChecks);
    await new Promise((resolve) => setTimeout(resolve, HEALTH_CHECK_INTERVAL));
  }
}
