"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, Calendar, BookOpen, CheckCircle2, Clock, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/AppHeader"
import { cn } from "@/lib/utils"
import { MarkdownText } from "@/components/ui/markdown-text"

// API Configuration
const API_BASE_URL = "http://localhost:3001"
const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone
const USER_ID = "550e8400-e29b-41d4-a716-446655440000"

interface Message {
    role: "user" | "assistant"
    content: string
    type?: "plan_generated" | "clarification" | "general"
    plan?: any
    planId?: string
    timestamp: Date
}

interface PlanCardProps {
    plan: any
    planId: string
    onApply: (planId: string) => void
    isApplying: boolean
}

function PlanCard({ plan, planId, onApply, isApplying }: PlanCardProps) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-5">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-primary/20 p-1.5 rounded-lg">
                                <BookOpen className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg text-foreground tracking-tight">{plan.goal}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground mt-3">
                            <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md border border-white/5">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                <span>{plan.total_days} days</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md border border-white/5">
                                <Clock className="h-3.5 w-3.5 text-blue-400" />
                                <span>{Math.floor(plan.daily_time_minutes / 60)}h {plan.daily_time_minutes % 60}m daily</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md border border-white/5">
                                <Target className="h-3.5 w-3.5 text-purple-400" />
                                <span>{plan.schedule.length} sessions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5 pt-2">
                {/* Strategies */}
                <div className="mb-5">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mb-2.5">Strategy</p>
                    <div className="flex flex-wrap gap-2">
                        {plan.learning_strategy.map((strategy: string, index: number) => (
                            <span
                                key={index}
                                className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-secondary/50 text-secondary-foreground border border-white/5 shadow-sm"
                            >
                                {strategy.replace('_', ' ')}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Timeline Preview */}
                <div className="relative space-y-0 text-sm mb-5 pl-2">
                    <div className="absolute left-[3px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-white/10 to-primary/50" />

                    {/* Start */}
                    <div className="relative flex items-center gap-4 py-2 group">
                        <div className="absolute left-[-4px] w-2 h-2 rounded-full bg-background border-2 border-primary z-10 group-hover:scale-125 transition-transform" />
                        <span className="text-xs font-semibold text-primary w-12 shrink-0">Day 1</span>
                        <div className="flex-1 p-2 rounded-lg bg-white/5 border border-white/5 text-foreground/90 text-xs">
                            {plan.schedule[0].topic}
                        </div>
                    </div>

                    {/* Middle (if exists) */}
                    {plan.schedule.length > 2 && (
                        <div className="relative flex items-center gap-4 py-2 group">
                            <div className="absolute left-[-4px] w-2 h-2 rounded-full bg-background border-2 border-muted-foreground z-10" />
                            <span className="text-xs font-medium text-muted-foreground w-12 shrink-0">Day {Math.floor(plan.total_days / 2) + 1}</span>
                            <div className="flex-1 p-2 rounded-lg bg-transparent border border-white/5 text-muted-foreground text-xs">
                                {plan.schedule[Math.floor(plan.total_days / 2)].topic}
                            </div>
                        </div>
                    )}

                    {/* End */}
                    <div className="relative flex items-center gap-4 py-2 group">
                        <div className="absolute left-[-4px] w-2 h-2 rounded-full bg-background border-2 border-primary z-10 group-hover:scale-125 transition-transform" />
                        <span className="text-xs font-semibold text-primary w-12 shrink-0">Day {plan.total_days}</span>
                        <div className="flex-1 p-2 rounded-lg bg-white/5 border border-white/5 text-foreground/90 text-xs">
                            {plan.schedule[plan.total_days - 1].topic}
                        </div>
                    </div>
                </div>

                {/* Full Schedule Expandable */}
                {expanded && (
                    <div className="mb-5 max-h-64 overflow-y-auto rounded-xl border border-white/5 bg-black/20 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <div className="p-3 space-y-1">
                            {plan.schedule.map((day: any, index: number) => (
                                <div key={index} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                                    <span className="text-[10px] font-bold text-muted-foreground min-w-[40px] pt-0.5 group-hover:text-primary transition-colors">Day {day.day}</span>
                                    <div className="flex-1">
                                        <p className="text-xs text-foreground font-medium">{day.topic}</p>
                                        {day.notes && (
                                            <p className="text-[10px] text-muted-foreground mt-1 opacity-80">💡 {day.notes}</p>
                                        )}
                                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-blue-500" />
                                            {day.sessions} session{day.sessions > 1 ? 's' : ''} of {day.session_duration_minutes} min
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(!expanded)}
                        className="flex-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                        {expanded ? "Hide Schedule" : "View Full Schedule"}
                    </Button>
                    <Button
                        onClick={() => onApply(planId)}
                        disabled={isApplying}
                        size="sm"
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                    >
                        {isApplying ? (
                            <>
                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-3 w-3 mr-2" />
                                Add to Calendar
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export function StudyPlanChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "👋 **Welcome to your AI Study Partner!**\n\nI design personalized study schedules based on your goals.\n\n**Try asking:**\n\n📚 \"Prepare for DSA interviews in 4 weeks, 2 hours/day\"\n\n💻 \"Learn Next.js basics in 2 weeks, 1.5 hours daily\"\n\nTell me your goal and timeline!",
            type: "general",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isApplying, setIsApplying] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            role: "user",
            content: input,
            timestamp: new Date()
        }
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/study-plan/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": USER_ID,
                },
                body: JSON.stringify({
                    message: input,
                    timezone: USER_TIMEZONE,
                }),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || "Failed to process message")
            }

            const assistantMessage: Message = {
                role: "assistant",
                content: result.data.message || result.data.message,
                type: result.data.type,
                plan: result.data.plan,
                planId: result.data.planId,
                timestamp: new Date()
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            const errorMessage: Message = {
                role: "assistant",
                content: `❌ Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}`,
                type: "general",
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
            inputRef.current?.focus()
        }
    }

    const handleApplyPlan = async (planId: string) => {
        setIsApplying(true)

        try {
            const response = await fetch(`${API_BASE_URL}/study-plan/apply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": USER_ID,
                },
                body: JSON.stringify({
                    plan_id: planId,
                    timezone: USER_TIMEZONE,
                    options: {
                        preferred_time: "09:00"
                    }
                }),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || "Failed to apply plan")
            }

            const successMessage: Message = {
                role: "assistant",
                content: `✅ **Plan Applied Successfully!**\n\n🎉 Created ${result.data.tasks_created} study sessions\n📅 Starting: ${result.data.start_date}\n\nYour timeline has been populated. Check your calendar!`,
                type: "general",
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, successMessage])
        } catch (error) {
            const errorMessage: Message = {
                role: "assistant",
                content: `❌ Failed to add plan to calendar: ${error instanceof Error ? error.message : "Unknown error"}`,
                type: "general",
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsApplying(false)
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        })
    }

    return (
        <div className="flex h-screen flex-col bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <AppHeader maxWidth="4xl" />

            {/* Chat Container */}
            <div className="flex-1 overflow-hidden relative z-10">
                <div className="mx-auto max-w-4xl h-full flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-5 duration-500`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className={`flex items-start gap-4 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    {/* Avatar */}
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0 shadow-lg ${message.role === "user"
                                            ? "bg-primary text-primary-foreground shadow-primary/20"
                                            : "bg-card border border-white/5 shadow-white/5"
                                            }`}
                                    >
                                        {message.role === "user" ? (
                                            <span className="text-xs font-bold">You</span>
                                        ) : (
                                            <Sparkles className="h-4 w-4 text-primary" />
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className="flex flex-col gap-1.5 min-w-0">
                                        <div className={`flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                            {message.role === "assistant" ? "AI Mentor" : "You"} • {formatTime(message.timestamp)}
                                        </div>

                                        <div
                                            className={cn(
                                                "rounded-2xl px-5 py-4 shadow-sm backdrop-blur-sm transition-all",
                                                message.role === "user"
                                                    ? "rounded-tr-sm bg-primary/90 text-primary-foreground shadow-primary/10"
                                                    : "rounded-tl-sm bg-card/80 border border-white/5 text-foreground shadow-black/5"
                                            )}
                                        >
                                            <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                                <MarkdownText content={message.content} />
                                            </div>

                                            {/* Plan Card */}
                                            {message.type === "plan_generated" && message.plan && message.planId && (
                                                <div className="mt-4 -mx-1">
                                                    <PlanCard
                                                        plan={message.plan}
                                                        planId={message.planId}
                                                        onApply={handleApplyPlan}
                                                        isApplying={isApplying}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex items-start gap-4 animate-in fade-in duration-300">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-card border border-white/5 shadow-lg">
                                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                </div>
                                <div className="rounded-2xl rounded-tl-sm bg-card/50 border border-white/5 px-5 py-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium">Crafting your plan...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-gradient-to-t from-background via-background to-transparent pt-10">
                        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto group">
                            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                            <div className="relative flex items-center gap-2 p-2 bg-card/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all duration-300">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Describe your goal..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1 bg-transparent px-5 py-3 min-h-[50px] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    size="icon"
                                    className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <ArrowRight className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>
                            <p className="mt-3 text-[10px] text-center text-muted-foreground opacity-60">
                                AI can make mistakes. Review generated plans before applying.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
