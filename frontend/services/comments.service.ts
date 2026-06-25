import { api } from "@/lib/api";

export async function createComment(taskId: number, content: string) {
    try {
        const response = await api.post(`/tasks/${taskId}/comments`, { content })
        return response.data
    } catch (error) {
        console.log("error creating comment", error)
        throw error
    }
}

export async function fetchComment(taskId: number) {
    try {
        const response = await api.get(`/tasks/${taskId}/comments`)
        return response.data
    } catch (error) {
        console.log("error fetching comment", error)
        throw error
    }
}

export async function updateComment(commentId: number, content: string) {
    try {
        const response = await api.patch(`/comments/${commentId}`, { content })
        return response.data
    } catch (error) {
        console.log("error updating comment", error)
        throw error
    }
}

export async function deleteComment(commentId: number) {
    try {
        const response = await api.delete(`/comments/${commentId}`)
        return response.data
    } catch (error) {
        console.log("error deleting comment", error)
        throw error
    }
}

