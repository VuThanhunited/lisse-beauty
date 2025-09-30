// Test script to verify admin APIs
const fs = require("fs");
const path = require("path");

// Simple HTTP request function using Node.js built-in modules
const http = require("http");

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: parsed,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testAdminAPIs() {
  console.log("🧪 Testing Admin APIs...\n");

  const baseUrl = "localhost";
  const port = 5000;

  const tests = [
    {
      name: "Health Check",
      path: "/health",
    },
    {
      name: "Services List (Public)",
      path: "/api/services",
    },
    {
      name: "Admin Services (No Auth)",
      path: "/api/admin/services",
    },
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`URL: http://${baseUrl}:${port}${test.path}`);

      const options = {
        hostname: "127.0.0.1", // Use IPv4 instead of localhost
        port: port,
        path: test.path,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const result = await makeRequest(options);

      console.log(`Status: ${result.statusCode}`);
      if (result.statusCode === 200) {
        console.log("✅ SUCCESS");
      } else if (result.statusCode === 401) {
        console.log("🔒 UNAUTHORIZED (Expected for admin routes)");
      } else {
        console.log(`❌ ERROR: ${result.statusCode}`);
      }

      if (result.data && typeof result.data === "object") {
        console.log("Response:", JSON.stringify(result.data, null, 2));
      }

      console.log("---\n");
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}\n`);
    }
  }

  console.log("✅ Test completed!");
}

// Run tests
testAdminAPIs().catch(console.error);
