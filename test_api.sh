#!/bin/bash

# Configuration
BASE_URL="https://doorkeeper-10086.deno.dev"

# Check if AUTH_TOKEN is set in environment
if [ -z "$AUTH_TOKEN" ]; then
    echo "Error: AUTH_TOKEN environment variable is not set"
    echo "Please set it using: export AUTH_TOKEN=your-secret-token"
    exit 1
fi

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
TESTS_RUN=0
TESTS_PASSED=0

# Helper function to make curl requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3

    if [ -z "$data" ]; then
        curl -s -X "$method" \
            -H "Authorization: Bearer $AUTH_TOKEN" \
            -H "Content-Type: application/json" \
            "$BASE_URL$endpoint"
    else
        curl -s -X "$method" \
            -H "Authorization: Bearer $AUTH_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint"
    fi
}

# Helper function to run tests
run_test() {
    local test_name=$1
    local command=$2
    local expected_status=$3

    echo "Running test: $test_name"
    TESTS_RUN=$((TESTS_RUN + 1))

    response=$(eval "$command")
    status=$?

    if [ "$status" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ Test passed${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ Test failed${NC}"
        echo "Response: $response"
    fi
    echo "----------------------------------------"

    # Sleep briefly between tests
    sleep 1
}

# Clean up any existing services
echo "Cleaning up existing services..."
make_request "POST" "/v1/admin/purge" "{}"

# Test 1: Register a service without ID (should generate one)
TEST1_RESPONSE=$(make_request "PUT" "/v1/agent/service/register" '{
  "Name": "Test Service 1",
  "Address": "127.0.0.1",
  "Port": 8080,
  "Tags": ["test", "auto-id"],
  "Check": {
    "Type": "http",
    "HTTP": "http://127.0.0.1:8080/health"
  }
}')
SERVICE_ID=$(echo $TEST1_RESPONSE | grep -o '"serviceId":"[^"]*' | cut -d'"' -f4)
run_test "Register service without ID" "echo '$TEST1_RESPONSE' | grep -q 'Service registered successfully'" 0

# Test 2: Register a service with specific ID
run_test "Register service with ID" "make_request 'PUT' '/v1/agent/service/register' '{
  \"ID\": \"manual-service-1\",
  \"Name\": \"Test Service 2\",
  \"Address\": \"127.0.0.1\",
  \"Port\": 8081,
  \"Tags\": [\"test\", \"manual-id\"],
  \"Check\": {
    \"Type\": \"http\",
    \"HTTP\": \"http://127.0.0.1:8081/health\"
  }
}'" 0

# Test 3: Get all services
run_test "Get all services" "make_request 'GET' '/v1/health/service'" 0

# Test 4: Get service by auto-generated ID
run_test "Get service by auto-generated ID" "make_request 'GET' \"/v1/service/$SERVICE_ID\"" 0

# Test 5: Get service by manual ID
run_test "Get service by manual ID" "make_request 'GET' '/v1/service/manual-service-1'" 0

# Test 6: Get services by tag
run_test "Get services by tag" "make_request 'GET' '/v1/health/tag/test'" 0

# Test 7: Disable a service
run_test "Disable service" "make_request 'POST' '/v1/admin/service/manual-service-1/disable'" 0

# Test 8: Enable a service
run_test "Enable service" "make_request 'POST' '/v1/admin/service/manual-service-1/enable'" 0

# Test 9: Get health status for specific service
run_test "Get health status for specific service" "make_request 'GET' '/v1/health/service/Test Service 1'" 0

# Test 10: Get all health statuses
run_test "Get all health statuses" "make_request 'GET' '/v1/health/service'" 0

# Test 11: Deregister service with auto-generated ID
run_test "Deregister service with auto-generated ID" "make_request 'PUT' \"/v1/agent/service/deregister/$SERVICE_ID\"" 0

# Test 12: Deregister service with manual ID
run_test "Deregister service with manual ID" "make_request 'PUT' '/v1/agent/service/deregister/manual-service-1'" 0

# Test 13: Verify services are removed
run_test "Verify services are removed" "make_request 'GET' '/v1/health/service' | grep -q '{}'" 0

# Test 14: Try to get non-existent service (should fail gracefully)
run_test "Get non-existent service" "make_request 'GET' '/v1/service/non-existent' | grep -q 'Service not found'" 0

# Test 15: Register invalid service (missing required fields)
run_test "Register invalid service" "make_request 'PUT' '/v1/agent/service/register' '{
  \"Name\": \"Invalid Service\"
}' | grep -q 'Missing required fields'" 0

# Final cleanup
echo "Final cleanup..."
make_request "POST" "/v1/admin/purge" "{}"

# Print test results
echo "========================================="
echo "Test Results:"
echo "Tests Run: $TESTS_RUN"
echo "Tests Passed: $TESTS_PASSED"
echo "Success Rate: $((TESTS_PASSED * 100 / TESTS_RUN))%"
echo "========================================="