import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { services } from "../services/healthCheckService.ts";

export function getHealthStatus(context: Context) {
  const serviceName = decodeURIComponent(context.params.service_name || "");
  let serviceList;

  if (serviceName) {
    serviceList = Object.entries(services).filter(
        ([, service]) => service.name === serviceName
    );
  } else {
    serviceList = Object.entries(services);
  }

  context.response.body = Object.fromEntries(serviceList);
}