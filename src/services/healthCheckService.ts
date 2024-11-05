import { HEALTH_CHECK_INTERVAL } from "../config.ts";
import { log } from "../utils/logger.ts";

export const services: Record<string, { name: string, domain: string; port: number; tags: string[]; status: string; checkType: string; checkURL: string; lastChecked: Date | null }> = {};

export async function performHealthCheck() {
  while (true) {
    const healthChecks = Object.entries(services).map(async ([id, service]) => {
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
