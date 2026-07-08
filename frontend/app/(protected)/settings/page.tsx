'use client'

import { useState } from "react";
import { 
  Settings, 
  User, 
  Lock, 
  Briefcase, 
  Palette, 
  ShieldAlert, 
  Save, 
  Trash2, 
  LogOut,
  BellRing,
  Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"profile" | "account" | "workspace" | "appearance" | "security">("profile");

    return (
        <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6 text-slate-100 font-sans">
            
            {/* Header */}
            <div className="border-b border-slate-850 pb-5">
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Settings className="h-5 w-5 text-indigo-400" />
                    Account Settings
                </h1>
                <p className="text-xs text-slate-500 mt-1">Configure profile configurations and security attributes.</p>
            </div>

            {/* Selector tabs */}
            <div className="flex bg-slate-950/40 p-1.5 rounded-xl border border-slate-850 shrink-0 text-xs font-semibold w-full overflow-x-auto">
                {(["profile", "account", "workspace", "appearance", "security"] as const).map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)} 
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all capitalize cursor-pointer shrink-0 ${activeTab === tab ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {tab === 'profile' && <User className="h-3.5 w-3.5" />}
                        {tab === 'account' && <Lock className="h-3.5 w-3.5" />}
                        {tab === 'workspace' && <Briefcase className="h-3.5 w-3.5" />}
                        {tab === 'appearance' && <Palette className="h-3.5 w-3.5" />}
                        {tab === 'security' && <ShieldAlert className="h-3.5 w-3.5" />}
                        {tab}
                    </button>
                ))}
            </div>

            {/* TAB PANELS */}
            <div className="bg-slate-955/20 border border-slate-850 rounded-2xl p-6">
                
                {/* Profile panel */}
                {activeTab === "profile" && (
                    <div className="space-y-5 max-w-md">
                        <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-slate-900 pb-2">Profile Parameters</h3>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Full Name</label>
                            <Input placeholder="E.g. John Doe" defaultValue="Ujjwal" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider block">Email Address</label>
                            <Input placeholder="name@company.com" defaultValue="ujjwal@dsync.io" />
                        </div>
                        <div className="pt-2">
                            <Button variant="default">
                                <Save className="h-4 w-4 mr-1.5" /> Save Changes
                            </Button>
                        </div>
                    </div>
                )}

                {/* Account panel */}
                {activeTab === "account" && (
                    <div className="space-y-6 max-w-md">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-slate-900 pb-2">Change Password</h3>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Current Password</label>
                                <Input type="password" placeholder="••••••••" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">New Password</label>
                                <Input type="password" placeholder="••••••••" />
                            </div>
                            <div className="pt-1">
                                <Button variant="default">Update Password</Button>
                            </div>
                        </div>

                        <div className="border-t border-slate-900 pt-5 space-y-3">
                            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Danger Zone</h3>
                            <p className="text-slate-500 text-xs leading-relaxed">Deactivating your account deletes workspaces owned by you permanently.</p>
                            <Button variant="destructive">
                                <Trash2 className="h-4 w-4 mr-1.5" /> Delete Account
                            </Button>
                        </div>
                    </div>
                )}

                {/* Workspace panel */}
                {activeTab === "workspace" && (
                    <div className="space-y-5 max-w-md">
                        <h3 className="text-xs font-bold text-slate-355 uppercase tracking-wider border-b border-slate-900 pb-2">Workspace Preferences</h3>
                        
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Default Workspace</label>
                            <select className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none">
                                <option>Marketing Launch Space</option>
                                <option>API Gateways DevOps</option>
                            </select>
                        </div>

                        <div className="pt-2 border-t border-slate-900 space-y-3 text-xs font-semibold">
                            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Notification Preferences</span>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-indigo-650 h-4 w-4" />
                                <span className="text-slate-300">Email alert on assignment mentions</span>
                            </label>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-indigo-655 h-4 w-4" />
                                <span className="text-slate-300">Websockets push popup alerts</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Appearance panel */}
                {activeTab === "appearance" && (
                    <div className="space-y-5 max-w-md">
                        <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-slate-900 pb-2">Visual settings</h3>
                        
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Theme preference</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-3 bg-slate-900 border border-indigo-500/40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                                    <Laptop className="h-4.5 w-4.5 text-indigo-400" />
                                    Dark Mode
                                </button>
                                <button className="p-3 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                                    Light Mode (Coming)
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Accent color</label>
                            <div className="flex gap-2">
                                <button className="w-5.5 h-5.5 rounded-full bg-indigo-600 ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950 cursor-pointer" />
                                <button className="w-5.5 h-5.5 rounded-full bg-emerald-600 cursor-pointer" />
                                <button className="w-5.5 h-5.5 rounded-full bg-rose-600 cursor-pointer" />
                                <button className="w-5.5 h-5.5 rounded-full bg-amber-600 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Security panel */}
                {activeTab === "security" && (
                    <div className="space-y-5 max-w-md">
                        <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-b border-slate-900 pb-2">Sessions security</h3>
                        
                        <div className="space-y-2.5">
                            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Active Sessions Audit</span>
                            
                            <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                                <div className="space-y-0.5">
                                    <p className="font-semibold text-slate-200">Chrome Browser (Linux OS)</p>
                                    <span className="text-[9px] text-slate-500">IP: 192.168.1.15 • Active Session</span>
                                </div>
                                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">CURRENT</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-900">
                            <Button variant="destructive" className="w-full">
                                <LogOut className="h-4 w-4 mr-1.5" /> Logout All Other Devices
                            </Button>
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}
