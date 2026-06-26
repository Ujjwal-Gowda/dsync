"use client"

import { register } from "@/services/auth.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.")
            return
        }
        setIsLoading(true)
        const { name, email, password } = formData
        try {
            await register(name, email, password)
            router.push("/dashboard")
        } catch (err: any) {
            console.error("Register failed:", err);
            setError(err.message || "Something went wrong during registration.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-955 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6">
                
                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="bg-indigo-600 p-2 rounded-xl">
                        <Layers className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-base font-bold text-slate-400 tracking-tight">Dsync</span>
                    <h1 className="text-xl font-bold text-white tracking-tight">Create Account</h1>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Name
                        </label>
                        <Input 
                            type="text" 
                            name="name" 
                            required
                            value={formData.name} 
                            onChange={handleChange}
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Email
                        </label>
                        <Input 
                            type="email" 
                            name="email" 
                            required
                            value={formData.email} 
                            onChange={handleChange}
                            placeholder="name@company.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Password
                        </label>
                        <Input 
                            type="password" 
                            name="password" 
                            required
                            value={formData.password} 
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Confirm Password
                        </label>
                        <Input 
                            type="password" 
                            name="confirmPassword" 
                            required
                            value={formData.confirmPassword} 
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full mt-2"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Register"
                        )}
                    </Button>
                </form>

                {/* Switch redirect */}
                <div className="text-center pt-2">
                    <p className="text-slate-400 text-xs font-semibold">
                        Already have account?{" "}
                        <Link 
                            href="/login" 
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
