import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { purgeServices, toggleServiceStatus } from '../services/dataService.ts';

export async function purgeAllServices(context: Context) {
    try {
        await purgeServices();
        context.response.body = { message: "All services purged successfully" };
    } catch (error) {
        console.error("Purged but error occur", error);
        context.response.status = 500;
        context.response.body = { error: "Failed to purge services" };
    }
}

export async function enableService(context: Context) {
    const serviceId = context.params.service_id;
    const success = await toggleServiceStatus(serviceId, true);

    if (success) {
        context.response.body = { message: "Service enabled successfully" };
    } else {
        context.response.status = 404;
        context.response.body = { error: "Service not found" };
    }
}

export async function disableService(context: Context) {
    const serviceId = context.params.service_id;
    const success = await toggleServiceStatus(serviceId, false);

    if (success) {
        context.response.body = { message: "Service disabled successfully" };
    } else {
        context.response.status = 404;
        context.response.body = { error: "Service not found" };
    }
}
