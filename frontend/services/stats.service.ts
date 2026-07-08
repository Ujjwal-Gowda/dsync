import { api } from "@/lib/api";

export async function getUserStats() {
    try {
        const response = await api.get("/stats");
        return response.data;
    } catch (error) {
        console.error("Error fetching user dashboard stats", error);
        throw error;
    }
}
