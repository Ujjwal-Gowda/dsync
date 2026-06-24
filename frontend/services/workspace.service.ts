
import { api } from "@/lib/api";
import { Role } from "@/types/user";

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
        const response = await api.post("/workspaces", { name })
        return response.data
    } catch (error) {
        console.log("error creating workspace", error)
        throw error
    }
}


export async function fetchWorkspacesStats(workId: number) {
    try {
        const response = await api.get(`/workspaces/${workId}/stats`)
        return response.data
    } catch (error) {
        console.log("error fetching workspace stats", error)
        throw error
    }
}

export async function addWorkspacesMember(workId: number, userId: number, role: Role) {
    try {
        const response = await api.post(`/workspaces/${workId}/members`, { userId, role })
        return response.data
    } catch (error) {
        console.log("error adding member to workspace", error)
        throw error
    }
}


export async function getWorkspacesMembers(workId: number) {
    try {
        const response = await api.get(`/workspaces/${workId}/members`)
        return response.data
    } catch (error) {
        console.log("error fetching members from workspace", error)
        throw error
    }
}

export async function deleteWorkspacesMember(workId: number, userId: number) {
    try {
        const response = await api.delete(`/workspaces/${workId}/members/${userId}`)
        return response.data
    } catch (error) {
        console.log("error deleting member from workspace", error)
        throw error
    }
}




