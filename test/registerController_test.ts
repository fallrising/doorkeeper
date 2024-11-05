import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { registerService } from "../src/controllers/registerController.ts";
import { services } from "../src/services/healthCheckService.ts";

Deno.test("registerService should register a service", async () => {
  const context = {
    request: {
      body: () => Promise.resolve({
        value: {
          ID: "service1",
          Name: "example-service",
          Address: "example.com",
          Port: 80,
          Tags: ["tag1", "tag2"],
          Check: {
            Type: "http",
            HTTP: "http://example.com/health"
          }
        }
      })
    },
    response: {
      body: {},
      status: 0
    }
  };

  await registerService(context as any);

  assertEquals(services["service1"].domain, "example.com");
  assertEquals(services["service1"].port, 80);
  assertEquals(services["service1"].tags, ["tag1", "tag2"]);
  assertEquals(services["service1"].checkURL, "http://example.com/health");
});
