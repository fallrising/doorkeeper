import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import {getAllServices} from "../services/dataService.ts";
import { log } from "../utils/logger.ts";

export function getHealthStatus(context: Context) {
  const serviceName = decodeURIComponent(context.params.service_name || "");
  const serviceList = Object.entries(getAllServices()).filter(
      ([, service]) => service.name === serviceName
  );

  context.response.body = Object.fromEntries(serviceList);
}

export async function getAllHealthStatus(context: Context) {
  const len = (await getAllServices()).length;
  log(`get length: ${len}`);
  const serviceList = Object.entries(getAllServices());
  const serviceListLength = serviceList.length;
  log(`serviceListLength: ${serviceListLength}`);
  context.response.body = Object.fromEntries(serviceList);
}