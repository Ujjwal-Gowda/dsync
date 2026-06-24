import { api } from "@/lib/api";

export async function fetchActivity(workId: number) {
    try {
        const response = await api.get(`/activity/${workId}`)
        return response.data
    } catch (error) {
        console.log("error fetching activity", error)
        throw error
    }
}
