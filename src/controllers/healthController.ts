import { Context } from "https://deno.land/x/oak/mod.ts";
import { services } from "../services/healthCheckService.ts";

export function getHealthStatus(context: Context) {
  const serviceName = context.params.service_name;
  const serviceList = Object.entries(services).filter(
    ([, service]) => serviceName ? service.tags.includes(serviceName) : true
  );
  context.response.body = Object.fromEntries(serviceList);
}
