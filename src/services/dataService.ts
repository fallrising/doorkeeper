import { log } from "../utils/logger.ts";

export const kv = await Deno.openKv();

export async function saveService(id: string, serviceData: Record<string, unknown>) {
    await kv.set(["services", id], serviceData);
}

export async function getService(id: string) {
    return await kv.get(["services", id]);
}

export async function deleteService(id: string) {
    await kv.delete(["services", id]);
}

export async function getAllServices() {
    const services = [];
    try {
        log("Retrieving all services from KV store...");
        for await (const entry of kv.list({ prefix: ["services"] })) {
            services.push(entry.value);
            log(`Retrieved service: ${JSON.stringify(entry.value)}`);
        }
        log("Completed retrieving services.");
    } catch (error) {
        log(`Error retrieving services: ${error.message}`);
        throw new Error("Failed to retrieve services");
    }
    return services;
}

export async function printServiceByKey() {
    const key = ["services", "service1"];
    const result = await kv.get(key);

    if (result) {
        console.log(`Value for key ${JSON.stringify(key)}:`, result);
    } else {
        console.log(`No value found for key ${JSON.stringify(key)}`);
    }
}