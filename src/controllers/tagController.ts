import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import {getAllServices} from "../services/dataService.ts";

export async function getServicesByTag(context: Context) {
    const tag = decodeURIComponent(context.params.tag || "");
    const services = await getAllServices();
    const serviceList = Object.entries(services).filter(
        ([, service]) => service.tags.includes(tag)
    );

    context.response.body = Object.fromEntries(serviceList);
}