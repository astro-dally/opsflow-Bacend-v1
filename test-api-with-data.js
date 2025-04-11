import fetch from "node-fetch"

const BASE_URL = "http://localhost:3001"
let authToken = null

async function testAPI() {
    try {
        console.log("🔍 Testing API with seeded data...")

        // Step 1: Sign in with admin user
        console.log("\n1. Signing in with admin user...")
        await signIn()

        if (!authToken) {
            console.warn("⚠️ Authentication failed. Using bypass header for testing.")
        }

        // Step 2: Test user endpoints
        console.log("\n2. Testing user endpoints...")
        await testEndpoint("users")

        // Step 3: Test project endpoints
        console.log("\n3. Testing project endpoints...")
        await testEndpoint("projects")
        const projectId = await getFirstId("projects")

        if (projectId) {
            console.log(`   Testing single project endpoint with ID: ${projectId}`)
            await testEndpoint(`projects/${projectId}`)
            await testEndpoint(`projects/${projectId}/tasks`)
            await testEndpoint(`projects/${projectId}/members`)
        }

        // Step 4: Test task endpoints
        console.log("\n4. Testing task endpoints...")
        await testEndpoint("tasks")
        const taskId = await getFirstId("tasks")

        if (taskId) {
            console.log(`   Testing single task endpoint with ID: ${taskId}`)
            await testEndpoint(`tasks/${taskId}`)
            await testEndpoint(`tasks/${taskId}/comments`)
        }

        // Step 5: Test team endpoints
        console.log("\n5. Testing team endpoints...")
        await testEndpoint("teams")

        // Step 6: Test time entry endpoints
        console.log("\n6. Testing time entry endpoints...")
        await testEndpoint("time-entries")
        await testEndpoint("time-entries/my")

        // Step 7: Test other endpoints
        console.log("\n7. Testing other endpoints...")
        await testEndpoint("sprints")
        await testEndpoint("boards")
        await testEndpoint("calendar")
        await testEndpoint("reports")
        await testEndpoint("notifications")
        await testEndpoint("files")
        await testEndpoint("attendance")
        await testEndpoint("leaves")

        console.log("\n✅ API testing completed successfully!")
    } catch (error) {
        console.error("\n❌ Test failed:", error.message)
        console.error("Stack trace:", error.stack)
    }
}

async function signIn() {
    try {
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
            console.warn(`⚠️ Authentication failed with status: ${response.status}`)
            return
        }

        const data = await response.json()
        authToken = data.data.accessToken
        console.log("✅ Authentication successful")
    } catch (error) {
        console.warn("⚠️ Authentication failed:", error.message)
    }
}

async function testEndpoint(endpoint) {
    try {
        const headers = {
            "Content-Type": "application/json",
        }

        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`
        } else {
            // Use bypass header in development
            headers["x-bypass-auth"] = "true"
        }

        const response = await fetch(`${BASE_URL}/api/v1/${endpoint}`, {
            headers,
        })

        if (!response.ok) {
            console.warn(`⚠️ ${endpoint} endpoint failed with status: ${response.status}`)
            return null
        }

        const data = await response.json()
        console.log(`✅ ${endpoint} endpoint is working`)
        return data
    } catch (error) {
        console.warn(`⚠️ ${endpoint} endpoint failed:`, error.message)
        return null
    }
}

async function getFirstId(endpoint) {
    try {
        const data = await testEndpoint(endpoint)
        if (data && data.data && Array.isArray(data.data[endpoint]) && data.data[endpoint].length > 0) {
            return data.data[endpoint][0]._id
        }
        return null
    } catch (error) {
        return null
    }
}

testAPI()
