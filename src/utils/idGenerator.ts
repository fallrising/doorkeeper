import { v4 } from "https://deno.land/std/uuid/mod.ts";

export function generateServiceId(): string {
    return v4.generate();
}