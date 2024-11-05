import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import {getAllServices} from "../services/dataService.ts";

export function getServicesByTag(context: Context) {
    const tag = decodeURIComponent(context.params.tag || "");
    const serviceList = Object.entries(getAllServices()).filter(
        ([, service]) => service.tags.includes(tag)
    );

    context.response.body = Object.fromEntries(serviceList);
}