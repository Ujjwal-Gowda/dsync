import { api } from "@/lib/api";
import { Priority, Status } from "@/types/user";

enum sortBy {
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    priority = "priority",
    status = "status",
    title = "title"
}

export async function createTask(projId: number, title: string, description: string, priority: Priority, assignee: number, dueDate?: string) {
    try {
        const response = await api.post(`/projects/${projId}/task`, { title, description, priority, assignee, dueDate })
        return response.data
    } catch (error) {
        console.log("error creating task", error)
        throw error
    }
}

export async function getTasks(projId: number, page: number, limit: number, status: Status,
    priority: Priority, assigneeId: number, order: "asc" | "desc", sortBy: sortBy, search: string) {
    try {
        const response = await api.get(`/projects/${projId}/tasks?page=${page}&limit=${limit}&status=${status}&priority=${priority}
                                        &assigneeId=${assigneeId}&search=${search}&sortBy=${sortBy}&order=${order}`)
        return response.data
    } catch (error) {
        console.log("error fetching tasks", error)
        throw error
    }
}

export async function updateTask(taskId: number, title?: string, description?: string, priority?: Priority, assignee?: number, dueDate?: string | null) {
    try {
        const response = await api.patch(`/tasks/${taskId}`, { title, description, priority, assignee, dueDate })
        return response.data
    } catch (error) {
        console.log("error updating task", error)
        throw error
    }
}

export async function deleteTasks(taskId: number) {
    try {
        const response = await api.delete(`/tasks/${taskId}`)
        return response.data
    } catch (error) {
        console.log("error deleting task", error)
        throw error
    }
}

export async function updateTaskStatus(projId: number, status: Status) {
    try {
        const response = await api.patch(`/tasks/${projId}/status`, { status })
        return response.data
    } catch (error) {
        console.log("error updating task status", error)
        throw error
    }
}

export async function getTask(taskId: number) {
    try {
        const response = await api.get(`/tasks/${taskId}`)
        return response.data
    } catch (error) {
        console.log("error fetching task by id", error)
        throw error
    }
}
