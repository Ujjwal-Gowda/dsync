import { api } from "@/lib/api";

export async function getDashboardStats() {
    try {
        const response = await api.get("/dashboard/stats");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
}

export async function getDashboardActivity() {
    try {
        const response = await api.get("/dashboard/activity");
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard activity:", error);
        throw error;
    }
}

export async function getUpcomingTasks() {
    try {
        const response = await api.get("/dashboard/tasks/upcoming");
        return response.data;
    } catch (error) {
        console.error("Error fetching upcoming tasks:", error);
        throw error;
    }
}
