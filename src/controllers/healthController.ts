import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import {getAllServices} from "../services/dataService.ts";

export function getHealthStatus(context: Context) {
  const serviceName = decodeURIComponent(context.params.service_name || "");
  const serviceList = Object.entries(getAllServices()).filter(
      ([, service]) => service.name === serviceName
  );

  context.response.body = Object.fromEntries(serviceList);
}

export function getAllHealthStatus(context: Context) {
  const serviceList = Object.entries(getAllServices());
  context.response.body = Object.fromEntries(serviceList);
}