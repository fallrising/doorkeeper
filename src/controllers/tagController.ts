import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { services } from "../services/healthCheckService.ts";

export function getServicesByTag(context: Context) {
    const tag = decodeURIComponent(context.params.tag || "");
    const serviceList = Object.entries(services).filter(
        ([, service]) => service.tags.includes(tag)
    );

    context.response.body = Object.fromEntries(serviceList);
}