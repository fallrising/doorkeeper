import { openKv } from "https://deno.land/x/kv/mod.ts";

export const kv = await openKv();

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
    for await (const entry of kv.list({ prefix: ["services"] })) {
        services.push(entry.value);
    }
    return services;
}