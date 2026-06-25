
import { api } from "@/lib/api";
import { ProjectStatus } from "@/types/user";

export async function createProjects(workId: number, name: string, description: string) {
    try {
        const response = await api.post(`/workspaces/${workId}/projects`, { name, description })
        return response.data
    } catch (error) {
        console.log("error creating project", error)
        throw error
    }
}

export async function getProjects(workId: number, status?: ProjectStatus, search?: string) {
    try {
        const response = await api.get(`/workspaces/${workId}/projects?status=${status}&search=${search}`)
        return response.data
    } catch (error) {
        console.log("error fetching projects", error)
        throw error
    }
}

export async function updateProjects(projId: number, name?: string, description?: string, status?: ProjectStatus) {
    try {
        const formData = {
            name: name,
            description: description,
            status: status
        }
        const response = await api.patch(`/projects/${projId}`, formData)
        return response.data
    } catch (error) {
        console.log("error updating project", error)
        throw error
    }
}

export async function deleteProject(projId: number) {
    try {
        const response = await api.delete(`/projects/${projId}`)
        return response.data
    } catch (error) {
        console.log("error deleting projects", error)
        throw error
    }
}

export async function fetchProjectsStats(projId: number) {
    try {
        const response = await api.get(`/workspaces/${projId}/projstats`)
        return response.data
    } catch (error) {
        console.log("error fetching project stats", error)
        throw error
    }
}

export async function getProject(projId: number) {
    try {
        const response = await api.get(`/projects/${projId}`)
        return response.data
    } catch (error) {
        console.log("error fetching project by id", error)
        throw error
    }
}
