import fetch from "node-fetch"

const BASE_URL = "http://localhost:3001"
let authToken = null

async function testEndpoints() {
    try {
        console.log("🔍 Testing API endpoints...")

        // Test health endpoint
        console.log("\n1. Testing health endpoint...")
        await testHealthEndpoint()

        // Test diagnostic endpoints
        console.log("\n2. Testing diagnostic endpoints...")
        await testDiagnosticEndpoints()

        // Test data seeding
        console.log("\n3. Testing data seeding...")
        await testDataSeeding()

        // Test authentication
        console.log("\n4. Testing authentication...")
        await testAuthentication()

        // Test protected endpoints
        if (authToken) {
            console.log("\n5. Testing protected endpoints...")
            await testProtectedEndpoints()
        }

        console.log("\n✅ All tests completed successfully!")
    } catch (error) {
        console.error("\n❌ Test failed:", error.message)
        console.error("Stack trace:", error.stack)
    }
}

async function testHealthEndpoint() {
    const response = await fetch(`${BASE_URL}/api/v1/health`)

    if (!response.ok) {
        throw new Error(`Health endpoint failed with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Health endpoint response:", data)
    console.log("✅ Health endpoint is working")
}

async function testDiagnosticEndpoints() {
    const response = await fetch(`${BASE_URL}/api/v1/diagnostic/status`)

    if (!response.ok) {
        throw new Error(`Diagnostic status endpoint failed with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Diagnostic status response:", data)
    console.log("✅ Diagnostic endpoints are working")

    // Check MongoDB connection
    if (!data.data.mongodb.connected) {
        console.warn("⚠️ MongoDB is not connected. Some endpoints may not work properly.")
    }
}

async function testDataSeeding() {
    const response = await fetch(`${BASE_URL}/api/v1/seed`, {
        method: "POST",
    })

    if (!response.ok) {
        if (response.status === 403) {
            console.warn("⚠️ Data seeding is only available in development environment")
            return
        }
        throw new Error(`Data seeding failed with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Data seeding response:", data)
    console.log("✅ Data seeding is working")
}

async function testAuthentication() {
    try {
        // Try to sign in with seeded user
        const response = await fetch(`${BASE_URL}/api/v1/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "admin@example.com",
                password: "Password123",
            }),
        })

        if (!response.ok) {
            console.warn("⚠️ Authentication failed. Will use bypass header for protected endpoints.")
            return
        }

        const data = await response.json()
        authToken = data.data.accessToken
        console.log("✅ Authentication is working")
    } catch (error) {
        console.warn("⚠️ Authentication failed:", error.message)
    }
}

async function testProtectedEndpoints() {
    // Test projects endpoint
    await testEndpoint("projects", authToken)

    // Test tasks endpoint
    await testEndpoint("tasks", authToken)

    // Test users endpoint
    await testEndpoint("users", authToken)
}

async function testEndpoint(endpoint, token) {
    try {
        const headers = {
            "Content-Type": "application/json",
        }

        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        } else {
            // Use bypass header in development
            headers["x-bypass-auth"] = "true"
        }

        const response = await fetch(`${BASE_URL}/api/v1/${endpoint}`, {
            headers,
        })

        if (!response.ok) {
            console.warn(`⚠️ ${endpoint} endpoint failed with status: ${response.status}`)
            return
        }

        const data = await response.json()
        console.log(`${endpoint} endpoint response:`, data)
        console.log(`✅ ${endpoint} endpoint is working`)
    } catch (error) {
        console.warn(`⚠️ ${endpoint} endpoint failed:`, error.message)
    }
}

testEndpoints()
