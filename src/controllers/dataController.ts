import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { kv } from "../services/dataService.ts";
import { log } from "../utils/logger.ts";

export async function getServiceByKeyController(context: Context) {
    const serviceID = context.params.service_id;

    if (!serviceID) {
        context.response.status = 400;
        context.response.body = { error: "Missing service ID in request" };
        return;
    }

    const key = ["services", serviceID];
    const result = await kv.get(key);

    if (result) {
        log(`Fetched value for key ${JSON.stringify(key)}: ${JSON.stringify(result)}`);
        context.response.status = 200;
        context.response.body = result;
    } else {
        log(`No value found for key ${JSON.stringify(key)}`);
        context.response.status = 404;
        context.response.body = { error: "Service not found" };
    }
}
