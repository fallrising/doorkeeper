import { Context } from "https://deno.land/x/oak/mod.ts";
import { services } from "../services/healthCheckService.ts";

export async function registerService(context: Context) {
  try {
    const result = context.request.body();
    const body = await result.value;
    const { ID, Name, Address, Port, Tags, Check } = body;
    if (!ID || !Name || !Address || !Port) {
      context.response.status = 400;
      context.response.body = { error: "Missing required fields" };
      return;
    }
    services[ID] = {
      domain: Address,
      port: Port,
      tags: Tags || [],
      status: "unknown",
      checkType: Check?.Type || "http",
      checkURL: Check?.HTTP || `http://${Address}:${Port}/health`,
      lastChecked: null
    };
    context.response.body = { message: "Service registered successfully" };
  } catch (error) {
    console.error("Error registering service:", error);
    context.response.status = 400;
    context.response.body = { error: "Invalid request format" };
  }
}
