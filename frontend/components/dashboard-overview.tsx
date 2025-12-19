"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Calendar, MessageSquare, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/AppHeader"
import { cn } from "@/lib/utils"

export function DashboardOverview() {
    return (
        <div className="min-h-screen bg-background">
            <AppHeader />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, Student</h1>
                    <p className="text-muted-foreground">Here's what's happening today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Quick Access Cards */}
                    <Link href="/calendar" className="group">
                        <div className="h-full p-6 rounded-3xl border border-white/5 bg-card/50 hover:bg-card/80 transition-all backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Calendar className="w-24 h-24 text-primary" />
                            </div>
                            <div className="relative z-10">
                                <div className="bg-primary/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Calendar</h3>
                                <p className="text-sm text-muted-foreground mb-4">View your upcoming tasks and study schedule.</p>
                                <div className="flex items-center text-sm font-medium text-primary">
                                    Open Calendar <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/study-plan" className="group">
                        <div className="h-full p-6 rounded-3xl border border-white/5 bg-card/50 hover:bg-card/80 transition-all backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BookOpen className="w-24 h-24 text-blue-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="bg-blue-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                                    <BookOpen className="w-5 h-5 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Study Plans</h3>
                                <p className="text-sm text-muted-foreground mb-4">Generate and manage your AI study roadmaps.</p>
                                <div className="flex items-center text-sm font-medium text-blue-500">
                                    View Plans <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/chat" className="group">
                        <div className="h-full p-6 rounded-3xl border border-white/5 bg-card/50 hover:bg-card/80 transition-all backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MessageSquare className="w-24 h-24 text-purple-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="bg-purple-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                                    <MessageSquare className="w-5 h-5 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">AI Mentor</h3>
                                <p className="text-sm text-muted-foreground mb-4">Chat with your AI assistant for help and guidance.</p>
                                <div className="flex items-center text-sm font-medium text-purple-500">
                                    Start Chat <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    )
}
