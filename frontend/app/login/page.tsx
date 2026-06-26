"use client"

import { logIn } from "@/services/auth.service";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Mail, Lock, Layers, ArrowRight, Eye, EyeOff } from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("");
        setIsLoading(true);
        const { email, password } = formData
        try {
            await logIn(email, password)
            router.push("/dashboard")
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
                {/* Header / Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-tr from-indigo-500 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20 mb-4">
                        <Layers className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400 text-sm mt-1.5">Sign in to your Dsync dashboard</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Mail className="h-4.5 w-4.5" />
                            </span>
                            <input 
                                type="email" 
                                name="email" 
                                required
                                value={formData.email} 
                                onChange={handleChange}
                                placeholder="name@company.com"
                                className="w-full bg-slate-950 border border-slate-800/80 hover:border-slate-700/85 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                                Password
                            </label>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Lock className="h-4.5 w-4.5" />
                            </span>
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password" 
                                required
                                value={formData.password} 
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-slate-950 border border-slate-800/80 hover:border-slate-700/85 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2.5 pl-11 pr-10 text-sm text-slate-200 placeholder-slate-500 transition-all outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-sm cursor-pointer mt-2"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer redirection */}
                <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
                    <p className="text-slate-400 text-xs">
                        Don't have an account?{" "}
                        <Link 
                            href="/register" 
                            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                        >
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
