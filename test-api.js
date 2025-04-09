import fetch from "node-fetch"

const BASE_URL = "http://localhost:3001"

async function testAPI() {
    try {
        console.log("Testing API health endpoint...")
        const response = await fetch(`${BASE_URL}/api/v1/health`)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("API Health Check Response:", data)
        console.log("\nAPI is working correctly! ✅")

        console.log("\nAvailable endpoints:")
        console.log(`${BASE_URL}/api/v1/auth/signin - Sign in`)
        console.log(`${BASE_URL}/api/v1/auth/signup - Sign up`)
        console.log(`${BASE_URL}/api/v1/users - Get users (requires authentication)`)
        console.log(`${BASE_URL}/api/v1/projects - Get projects (requires authentication)`)
        console.log(`${BASE_URL}/api/v1/tasks - Get tasks (requires authentication)`)
    } catch (error) {
        console.error("Error testing API:", error.message)

        console.log("\nTroubleshooting tips:")
        console.log("1. Make sure the server is running on port 3001")
        console.log("2. Check if MongoDB is connected properly")
        console.log("3. Verify that all environment variables are set correctly")
        console.log("4. Check server logs for any errors")
    }
}

testAPI()
