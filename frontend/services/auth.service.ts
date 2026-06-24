import { api } from "@/lib/api";


export async function register(name: string, email: string, password: string) {
    try {
        const response = await api.post("/auth/register", { name, email, password });
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
}

export async function logIn(email: string, password: string) {
    try {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    } catch (error) {
        console.error("Error login:", error);
        throw error;
    }
}

export async function logOut() {
    try {
        const response = await api.get("/auth/logout");
        return response.data;
    } catch (error) {
        console.error("Error logout:", error);
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        const response = await api.get("/me");
        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}
