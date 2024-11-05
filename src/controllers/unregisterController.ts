import { Context } from "https://deno.land/x/oak/mod.ts";
import { services } from "../services/healthCheckService.ts";

export function unregisterService(context: Context) {
  const serviceID = context.params.service_id;
  if (services[serviceID]) {
    delete services[serviceID];
    context.response.body = { message: "Service unregistered successfully" };
  } else {
    context.response.status = 404;
    context.response.body = { error: "Service not found" };
  }
}
