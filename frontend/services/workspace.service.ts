
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

export async function createWorkspaces(name: string) {
    try {
        const response = await api.post("/workspaces", name)
        return response.data
    } catch (error) {
        console.log("error creating workspace", error)
        throw error
    }
}

export async function createWorkspaces(name: string) {
    try {
        const response = await api.post("/workspaces", name)
        return response.data
    } catch (error) {
        console.log("error creating workspace", error)
        throw error
    }
}
