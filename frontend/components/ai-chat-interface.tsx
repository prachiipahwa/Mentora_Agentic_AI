"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Sparkles, Calendar, ExternalLink, ArrowRight } from "lucide-react"
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
    type?: "task_created" | "clarification" | "general"
    task?: any
    timestamp: Date
}

export function AIChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "👋 **Hello! I'm your Task Assistant.**\n\nI turn your natural language into organized tasks.\n\n**Try saying:**\n\n📚 \"Study React hooks tomorrow at 7pm for 2 hours\"\n\n📝 \"Complete project report next Monday by 3pm\"\n\nJust type what you need to do!",
            type: "general",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        // Focus input on mount
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
            const response = await fetch(`${API_BASE_URL}/calendar/chat`, {
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
                content: result.data.message,
                type: result.data.type,
                task: result.data.task,
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
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
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
                                {/* Message Bubble */}
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
                                            {message.role === "assistant" ? "Task AI" : "You"} • {formatTime(message.timestamp)}
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

                                            {/* Task Details Card */}
                                            {message.type === "task_created" && message.task && (
                                                <div className="mt-4 -mx-1 rounded-xl border border-white/10 bg-black/20 p-4">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                                        <Calendar className="h-3.5 w-3.5 text-primary" />
                                                        <span className="font-mono opacity-70">ID: {message.task.id.substring(0, 8)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{message.task.title}</p>
                                                            <p className="text-xs text-muted-foreground mt-0.5">{message.task.deadlineFormatted || "No deadline"}</p>
                                                        </div>
                                                        <Link href="/calendar">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-2 text-xs h-8 bg-white/5 border-white/10 hover:bg-white/10"
                                                            >
                                                                View
                                                                <ArrowRight className="h-3 w-3" />
                                                            </Button>
                                                        </Link>
                                                    </div>
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
                                        <p className="text-xs text-muted-foreground font-medium">Processing request...</p>
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
                                    placeholder="Type a task command..."
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
