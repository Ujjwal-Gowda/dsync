import { api } from "@/lib/api";

export async function register({ name, email, password }: { name: string, email: string, password: string }) {
    try {
        const formData = { name: name, email: email, password: password }
        const response = await api.post("/auth/register", formData)
        return response.data
    } catch (error) {
        console.log("error registering", error)
        throw error
    }
}

export async function logIn({ email, password }: { email: string, password: string }) {
    try {
        const formData = { email: email, password: password }
        const response = await api.post("/auth/login", formData)
        return response.data
    } catch (error) {
        console.log("error login", error)
        throw error
    }
}

export async function logOut() {
    try {
        const response = await api.get("/auth/logout")
        return response.data
    } catch (error) {
        console.log("error logout", error)
        throw error
    }
}

export async function getCurrentUser() {
    try {
        const response = await api.get("/me")
        return response.data
    } catch (error) {
        console.log("error fetching user info", error)
        throw error
    }
}
