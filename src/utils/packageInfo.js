import { readFile } from "fs/promises"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Get package information safely without direct import
 * @returns {Promise<Object>} Package information
 */
export async function getPackageInfo() {
    try {
        const packagePath = join(__dirname, "../../package.json")
        const packageData = await readFile(packagePath, "utf8")
        return JSON.parse(packageData)
    } catch (error) {
        console.error("Error reading package.json:", error)
        return {
            name: "opsfloww-backend",
            version: "1.0.0",
        }
    }
}

/**
 * Get package version
 * @returns {Promise<string>} Package version
 */
export async function getPackageVersion() {
    const packageInfo = await getPackageInfo()
    return packageInfo.version
}
