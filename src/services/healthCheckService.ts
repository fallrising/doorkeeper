// src/services/healthCheckService.ts
import { HEALTH_CHECK_INTERVAL } from "../config.ts";
import { log } from "../utils/logger.ts";
import { getAllServices } from "./dataService.ts";

export async function performHealthCheck() {
  log("Starting health check service...");
  let checkCount = 0;

  while (true) {
    checkCount++;
    log(`\n=== Starting health check iteration #${checkCount} ===`);
    const startTime = new Date();

    try {
      const services = await getAllServices();
      log(`Found ${Object.keys(services).length} services to check`);

      const healthChecks = Object.entries(services).map(async ([id, service]) => {
        log(`Checking service ${id} (${service.name}) at ${service.checkURL}`);

        try {
          if (service.checkType === "http") {
            const response = await fetch(service.checkURL);
            const previousStatus = service.status;
            service.status = response.ok ? "healthy" : "unhealthy";

            // Log status changes
            if (previousStatus !== service.status) {
              log(`${id} (${service.name}) status changed: ${previousStatus} -> ${service.status}`);
            }

            // Log response details
            log(`${id} (${service.name}) responded with status ${response.status}`);
          } else {
            service.status = "unimplemented check type";
            log(`${id} (${service.name}) has unimplemented check type: ${service.checkType}`);
          }
        } catch (error) {
          service.status = "unhealthy";
          log(`Error checking ${id} (${service.name}): ${error.message}`);
        } finally {
          service.lastChecked = new Date();
        }
      });

      await Promise.all(healthChecks);

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      log(`=== Health check iteration #${checkCount} completed in ${duration}ms ===\n`);

    } catch (error) {
      log(`Error during health check iteration #${checkCount}: ${error.message}`);
    }

    log(`Waiting ${HEALTH_CHECK_INTERVAL}ms before next health check...`);
    await new Promise((resolve) => setTimeout(resolve, HEALTH_CHECK_INTERVAL));
  }
}