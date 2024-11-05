import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import {getAllServices} from "../services/dataService.ts";

export async function getHealthStatus(context: Context) {
  const serviceName = decodeURIComponent(context.params.service_name || "");
  const services = await getAllServices()
  const serviceList = Object.entries(services).filter(
      ([, service]) => service.name === serviceName
  );

  context.response.body = Object.fromEntries(serviceList);
}

export async function getAllHealthStatus(context: Context) {
  const services = await getAllServices()
  const serviceList = Object.entries(services);
  context.response.body = Object.fromEntries(serviceList);
}