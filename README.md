# doorkeeper

curl -X PUT "https://YOUR_DENO_URL.deno.dev/v1/agent/service/register" \
-H "Content-Type: application/json" \
-d '{
  "ID": "service1",
  "Name": "Test Service",
  "Address": "127.0.0.1",
  "Port": 8080,
  "Tags": ["test", "deno", "tag1"],
  "Check": {
    "Type": "http",
    "HTTP": "http://127.0.0.1:8080/health"
  }
}'

curl -X PUT "https://YOUR_DENO_URL.deno.dev/v1/agent/service/deregister/service1"
{"message":"Service unregistered successfully"}%

curl "https://YOUR_DENO_URL.deno.dev/v1/health/service/"

curl "https://YOUR_DENO_URL.deno.dev/v1/health/service/tag1"

