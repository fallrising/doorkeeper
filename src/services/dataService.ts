import { log } from "../utils/logger.ts";
import { generateServiceId } from "../utils/idGenerator.ts";

export const kv = await Deno.openKv();

interface ServiceData {
    id: string;
    name: string;
    domain: string;
    port: number;
    tags: string[];
    status: string;
    checkType: string;
    checkURL: string;
    lastChecked: Date | null;
    enabled?: boolean;
}

export async function saveService(id: string | undefined, serviceData: Omit<ServiceData, "id">): Promise<string> {
    const serviceId = id || generateServiceId();
    const fullServiceData: ServiceData = {
        ...serviceData,
        id: serviceId,
        enabled: true // Default to enabled
    };

    await kv.set(["services", serviceId], fullServiceData);
    log(`Saved service with ID: ${serviceId}`);
    return serviceId;
}

export async function getService(id: string) {
    const result = await kv.get(["services", id]);
    return result.value as ServiceData | null;
}

export async function deleteService(id: string): Promise<boolean> {
    const service = await getService(id);
    if (!service) return false;

    await kv.delete(["services", id]);
    log(`Deleted service with ID: ${id}`);
    return true;
}

export async function getAllServices(): Promise<Record<string, ServiceData>> {
    const services: Record<string, ServiceData> = {};
    try {
        log("Retrieving all services from KV store...");
        for await (const entry of kv.list({ prefix: ["services"] })) {
            const serviceData = entry.value as ServiceData;
            services[serviceData.id] = serviceData;
            log(`Retrieved service: ${JSON.stringify(serviceData)}`);
        }
    } catch (error) {
        log(`Error retrieving services: ${error.message}`);
        throw new Error("Failed to retrieve services");
    }
    return services;
}

export async function toggleServiceStatus(id: string, enabled: boolean): Promise<boolean> {
    const service = await getService(id);
    if (!service) return false;

    service.enabled = enabled;
    await kv.set(["services", id], service);
    log(`Service ${id} ${enabled ? 'enabled' : 'disabled'}`);
    return true;
}

export async function purgeServices(): Promise<void> {
    for await (const entry of kv.list({ prefix: ["services"] })) {
        await kv.delete(entry.key);
    }
    log("All services purged from the system");
}
