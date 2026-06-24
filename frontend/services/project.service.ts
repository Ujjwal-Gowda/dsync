
import { api } from "@/lib/api";

export async function getWorkspaces() {
    try {
        const response = await api.get("/workspaces")
        return response.data
    } catch (error) {
        console.log("error fetching workspace", error)
        throw error
    }
}
