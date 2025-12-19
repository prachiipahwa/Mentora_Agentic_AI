"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    Plus,
    CheckCircle2,
    Clock,
    Loader2,
    AlertCircle,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    CalendarDays,
    ListTodo,
    RefreshCw,
    ExternalLink,
    Trash2,
    Edit,
    MessageSquare,
    Flame,
    Circle
} from "lucide-react"
import {
    format,
    isSameDay,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addMonths,
    subMonths,
    addWeeks,
    subWeeks,
    addDays
} from "date-fns"
import { TaskModal } from "@/components/task-modal"
import { SummaryPanel } from "@/components/summary-panel"
import { AppHeader } from "@/components/AppHeader"
import { cn } from "@/lib/utils"
import { MarkdownText } from "@/components/ui/markdown-text"

// API Configuration - change this to your backend URL
const API_BASE_URL = "http://localhost:3001"

// Get user timezone
const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

// Demo user ID (in production, this comes from auth)
const USER_ID = "550e8400-e29b-41d4-a716-446655440000"

interface Task {
    id: string
    title: string
    description: string | null
    deadline: string
    deadlineFormatted: string
    deadlineRelative: string
    timezone: string
    status: "pending" | "in_progress" | "completed" | "cancelled"
    googleCalendarEventId: string | null
    googleTaskId: string | null
    isSynced: boolean
    syncedAt: string | null
    createdAt: string
    updatedAt: string
    start_time?: string
    category?: string
}

interface TaskStats {
    total: number
    pending: number
    inProgress: number
    completed: number
    cancelled: number
    streak?: number
    hours?: number
}

interface Summary {
    summary: string
    tasks: Array<{
        id: string
        title: string
        status: string
        deadline: string
    }>
    stats: TaskStats
    generatedAt: string
}

export function CalendarInterface() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [stats, setStats] = useState<TaskStats | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState<"today" | "week">("today")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [summary, setSummary] = useState<Summary | null>(null)
    const [isSummaryLoading, setIsSummaryLoading] = useState(false)
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
    const [isGoogleConnected, setIsGoogleConnected] = useState(false)

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [view, setView] = useState<"week" | "month">("month")

    // Calendar Logic
    const nextPeriod = () => {
        if (view === "month") {
            setCurrentDate(addMonths(currentDate, 1))
        } else {
            setCurrentDate(addWeeks(currentDate, 1))
        }
    }

    const prevPeriod = () => {
        if (view === "month") {
            setCurrentDate(subMonths(currentDate, 1))
        } else {
            setCurrentDate(subWeeks(currentDate, 1))
        }
    }

    const days = React.useMemo(() => {
        if (view === "month") {
            const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
            const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
            return eachDayOfInterval({ start, end })
        } else {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 })
            const end = endOfWeek(currentDate, { weekStartsOn: 1 })
            return eachDayOfInterval({ start, end })
        }
    }, [currentDate, view])

    // Fetch tasks on load and tab change
    useEffect(() => {
        fetchTasks()
    }, [activeTab])

    const fetchTasks = async () => {
        setIsLoading(true)
        setError("")

        try {
            const endpoint = activeTab === "today" ? "today" : "week"
            const response = await fetch(
                `${API_BASE_URL}/calendar/tasks/${endpoint}?timezone=${encodeURIComponent(USER_TIMEZONE)}`,
                {
                    headers: {
                        "X-User-Id": USER_ID,
                    },
                }
            )

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || "Failed to fetch tasks")
            }

            setTasks(result.data.tasks)
            if (result.data.stats) {
                setStats(result.data.stats)
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch tasks"
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateTask = async (taskData: {
        title: string
        description: string
        deadline: string
    }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/calendar/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": USER_ID,
                },
                body: JSON.stringify({
                    ...taskData,
                    timezone: USER_TIMEZONE,
                }),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || "Failed to create task")
            }

            // Refresh tasks
            fetchTasks()
            setIsModalOpen(false)
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create task"
            setError(errorMessage)
        }
    }

    const handleUpdateStatus = async (taskId: string, newStatus: string) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/calendar/tasks/${taskId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "X-User-Id": USER_ID,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            )

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || "Failed to update task")
            }

            // Refresh tasks
            fetchTasks()
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update task"
            setError(errorMessage)
        }
    }

    const handleSync = async () => {
        setIsSyncing(true)
        setError("")

        try {
            const response = await fetch(`${API_BASE_URL}/calendar/sync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": USER_ID,
                },
                body: JSON.stringify({ syncToTasks: true }),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || "Failed to sync")
            }

            // Refresh tasks to show updated sync status
            fetchTasks()
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Sync failed"
            setError(errorMessage)
        } finally {
            setIsSyncing(false)
        }
    }

    const handleGenerateSummary = async () => {
        setIsSummaryLoading(true)
        setError("")

        try {
            const endpoint = activeTab === "today" ? "daily" : "weekly"
            const response = await fetch(
                `${API_BASE_URL}/calendar/summary/${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-User-Id": USER_ID,
                    },
                    body: JSON.stringify({ timezone: USER_TIMEZONE }),
                }
            )

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || "Failed to generate summary")
            }

            setSummary(result.data)
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to generate summary"
            setError(errorMessage)
        } finally {
            setIsSummaryLoading(false)
        }
    }

    const handleConnectGoogle = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/calendar/connect-google`, {
                method: "POST",
                headers: {
                    "X-User-Id": USER_ID,
                },
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error?.message || "Failed to initiate Google OAuth")
            }

            // Open Google OAuth in new window
            window.open(result.data.authUrl, "_blank", "width=600,height=700")
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to connect Google"
            setError(errorMessage)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "text-green-500 bg-green-500/10"
            case "in_progress":
                return "text-blue-500 bg-blue-500/10"
            case "pending":
                return "text-yellow-500 bg-yellow-500/10"
            case "cancelled":
                return "text-red-500 bg-red-500/10"
            default:
                return "text-muted-foreground bg-muted"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="h-4 w-4" />
            case "in_progress":
                return <Clock className="h-4 w-4" />
            case "pending":
                return <ListTodo className="h-4 w-4" />
            default:
                return <AlertCircle className="h-4 w-4" />
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
            {/* Header */}
            <AppHeader maxWidth="6xl" />

            {/* Action Bar */}
            <div className="border-b border-border/50 bg-background/50">
                <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-end gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleConnectGoogle}
                        className="gap-2"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Connect Google
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="gap-2"
                    >
                        {isSyncing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                        Sync
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                    >
                        <Plus className="h-4 w-4" />
                        New Task
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <div className="mx-auto max-w-6xl h-full flex flex-col">
                    {/* Tabs */}
                    <div className="px-6 pt-6">
                        <div className="flex items-center gap-2 p-1 bg-card rounded-xl border border-border/50 w-fit">
                            <button
                                onClick={() => setActiveTab("today")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "today"
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setActiveTab("week")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "week"
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                This Week
                            </button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20">
                        {/* Background elements */}
                        <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />



                        <main className="container mx-auto px-4 py-8 pb-24 relative z-10 max-w-7xl">
                            {/* Stats Grid (Bento Box) */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-white/5 bg-card/50 p-6 backdrop-blur-xl transition-all hover:bg-card/60 group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Flame className="w-24 h-24 text-primary" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                            <Flame className="w-5 h-5 text-orange-500" />
                                            <span className="text-sm font-medium uppercase tracking-wider">Current Streak</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-bold text-foreground">{stats?.streak || 0}</span>
                                            <span className="text-xl font-medium text-muted-foreground">days</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2 max-w-[80%]">
                                            You're on fire! 🔥 Keep studying daily to maintain your momentum.
                                        </p>
                                        <div className="mt-4 h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 w-[60%]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-white/5 bg-card/50 p-6 backdrop-blur-xl transition-all hover:bg-card/60 group">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-medium uppercase tracking-wider">Completed</span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <span className="text-4xl font-bold text-foreground">{stats?.completed || 0}</span>
                                            <p className="text-xs text-muted-foreground mt-1">Tasks this week</p>
                                        </div>
                                        <div className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                            +12%
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-white/5 bg-card/50 p-6 backdrop-blur-xl transition-all hover:bg-card/60 group">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm font-medium uppercase tracking-wider">Focus Time</span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <span className="text-4xl font-bold text-foreground">{stats?.hours || 0}</span>
                                            <p className="text-xs text-muted-foreground mt-1">Hours studied</p>
                                        </div>
                                        <div className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                                            Target: 20h
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Calendar Section - Hidden in Week View */}
                                {view === "month" && (
                                    <div className="lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-left-5 duration-500">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/30 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 bg-background/50 rounded-xl p-1 border border-white/5">
                                                <Button variant="ghost" size="icon" onClick={prevPeriod} className="h-8 w-8 hover:bg-white/5 rounded-lg">
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                                <span className="text-sm font-bold min-w-[140px] text-center">
                                                    {format(currentDate, "MMMM yyyy")}
                                                </span>
                                                <Button variant="ghost" size="icon" onClick={nextPeriod} className="h-8 w-8 hover:bg-white/5 rounded-lg">
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="flex gap-1 bg-background/50 p-1 rounded-xl border border-white/5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setView("week")}
                                                    className="text-xs px-3 py-1 h-8 rounded-lg transition-all text-muted-foreground hover:bg-white/5"
                                                >
                                                    Week
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setView("month")}
                                                    className="text-xs px-3 py-1 h-8 rounded-lg transition-all bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                                >
                                                    Month
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="bg-card/30 rounded-3xl border border-white/5 backdrop-blur-sm overflow-hidden p-6 min-h-[500px]">
                                            {/* Calendar Grid Header */}
                                            <div className="grid grid-cols-7 mb-4">
                                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                                    <div key={day} className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest py-2">
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Calendar Days */}
                                            <div className="grid grid-cols-7 gap-2">
                                                {days.map((day, idx) => {
                                                    const isSelected = isSameDay(day, selectedDate)
                                                    const isToday = isSameDay(day, new Date())
                                                    const isCurrentMonth = isSameDay(day, startOfMonth(currentDate)) || (day >= startOfMonth(currentDate) && day <= endOfMonth(currentDate))

                                                    // Find tasks for this day
                                                    const dayTasks = tasks.filter(t => isSameDay(new Date(t.deadline), day))
                                                    const hasTasks = dayTasks.length > 0

                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setSelectedDate(day)}
                                                            className={cn(
                                                                "relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-300 border hover:border-primary/50 group",
                                                                isSelected
                                                                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105 border-primary z-10"
                                                                    : "bg-card/40 text-foreground hover:bg-card/80 border-transparent",
                                                                !isCurrentMonth && view === "month" && "opacity-30 grayscale"
                                                            )}
                                                        >
                                                            <span className={cn("text-sm font-bold", isSelected ? "text-primary-foreground" : "text-foreground")}>
                                                                {format(day, "d")}
                                                            </span>
                                                            {isToday && !isSelected && (
                                                                <span className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                            )}

                                                            {/* Task Indicators */}
                                                            {hasTasks && !isSelected && (
                                                                <div className="absolute bottom-3 flex gap-1">
                                                                    {dayTasks.slice(0, 3).map((_, i) => (
                                                                        <div key={i} className="w-1 h-1 rounded-full bg-primary/70" />
                                                                    ))}
                                                                    {dayTasks.length > 3 && <div className="w-1 h-1 rounded-full bg-primary/40" />}
                                                                </div>
                                                            )}

                                                            {hasTasks && isSelected && (
                                                                <div className="absolute bottom-3 flex gap-1">
                                                                    <div className="w-1 h-1 rounded-full bg-white/70" />
                                                                </div>
                                                            )}

                                                            {/* Hover Tooltip */}
                                                            {hasTasks && (
                                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[180px] bg-popover/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-50 invisible group-hover:visible">
                                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{format(day, "MMM d")}</p>
                                                                    <div className="space-y-1">
                                                                        {dayTasks.slice(0, 3).map(task => (
                                                                            <div key={task.id} className="text-xs truncate text-left text-foreground flex items-center gap-1.5">
                                                                                <div className={cn("w-1 h-1 rounded-full shrink-0",
                                                                                    task.status === 'completed' ? 'bg-green-500' : 'bg-primary'
                                                                                )} />
                                                                                {task.title}
                                                                            </div>
                                                                        ))}
                                                                        {dayTasks.length > 3 && (
                                                                            <div className="text-[10px] text-muted-foreground text-left pl-2.5">
                                                                                +{dayTasks.length - 3} more
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={cn(
                                    "flex flex-col h-full space-y-6 transition-all duration-500",
                                    view === "month" ? "lg:col-span-4" : "lg:col-span-12 max-w-4xl mx-auto w-full"
                                )}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                {view === "week" && (
                                                    <Button variant="ghost" size="icon" onClick={() => setView("month")} className="h-8 w-8 -ml-2 rounded-full hover:bg-white/5">
                                                        <ChevronLeft className="h-5 w-5" />
                                                    </Button>
                                                )}
                                                <h2 className="text-2xl font-bold tracking-tight">
                                                    {view === 'week' ? "This Week's Schedule" : (isSameDay(selectedDate, new Date()) ? "Today" : format(selectedDate, "EEEE"))}
                                                </h2>
                                            </div>
                                            <p className="text-sm text-muted-foreground pl-0.5">
                                                {view === 'week'
                                                    ? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`
                                                    : format(selectedDate, "MMMM do")
                                                }
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            {/* Show View Toggle in Header when in Week View (since Calendar is hidden) */}
                                            {view === "week" && (
                                                <div className="flex gap-1 bg-card/50 p-1 rounded-xl border border-white/5 mr-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setView("week")}
                                                        className="text-xs px-3 py-1 h-8 rounded-lg transition-all bg-primary text-primary-foreground shadow-sm"
                                                    >
                                                        Week
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setView("month")}
                                                        className="text-xs px-3 py-1 h-8 rounded-lg transition-all text-muted-foreground hover:bg-white/5"
                                                    >
                                                        Month
                                                    </Button>
                                                </div>
                                            )}

                                            <Button size="icon" className="rounded-full h-10 w-10 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-transform active:scale-95" onClick={() => setIsModalOpen(true)}>
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-card/30 rounded-3xl border border-white/5 backdrop-blur-sm p-4 overflow-hidden flex flex-col min-h-[500px]">
                                        {isLoading ? (
                                            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                                <span>Loading schedule...</span>
                                            </div>
                                        ) : tasks.length > 0 ? (
                                            <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-1">
                                                {tasks.map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className="group bg-card/60 hover:bg-card border border-white/5 hover:border-primary/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer relative overflow-hidden"
                                                    >
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                                                        <div className="flex items-start gap-4">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleUpdateStatus(task.id, task.status === "completed" ? "pending" : "completed")
                                                                }}
                                                                className="mt-1 text-muted-foreground hover:text-primary transition-colors hover:scale-110 active:scale-90"
                                                            >
                                                                {task.status === "completed" ? (
                                                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                                                ) : (
                                                                    <Circle className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className={cn("font-medium text-sm leading-tight text-foreground", task.status === "completed" && "line-through text-muted-foreground")}>
                                                                    {task.title}
                                                                </h3>
                                                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        <span>{task.start_time ? format(new Date(task.start_time), "h:mm a") : "TBD"}</span>
                                                                    </div>
                                                                    {task.category && (
                                                                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-medium uppercase tracking-wider">
                                                                            {task.category}
                                                                        </span>
                                                                    )}
                                                                    <h2 className="text-lg font-semibold text-foreground">AI Summary</h2>
                                                                </div>

                                                                <div className="rounded-xl border border-border/50 bg-card p-4">
                                                                    {!summary && !isSummaryLoading && (
                                                                        <div className="text-center py-8">
                                                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-3">
                                                                                <Sparkles className="h-6 w-6 text-primary" />
                                                                            </div>
                                                                            <p className="text-sm text-muted-foreground mb-4">
                                                                                Generate an AI-powered summary of your {activeTab === "today" ? "daily" : "weekly"} tasks
                                                                            </p>
                                                                            <Button
                                                                                onClick={handleGenerateSummary}
                                                                                disabled={tasks.length === 0}
                                                                                size="sm"
                                                                                className="gap-2"
                                                                            >
                                                                                <Sparkles className="h-4 w-4" />
                                                                                Generate Summary
                                                                            </Button>
                                                                        </div>
                                                                    )}

                                                                    {isSummaryLoading && (
                                                                        <div className="flex items-center justify-center py-12">
                                                                            <div className="text-center">
                                                                                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                                                                                <p className="text-sm text-muted-foreground">Generating summary...</p>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {summary && !isSummaryLoading && (
                                                                        <div className="space-y-4">
                                                                            <div className="prose prose-sm dark:prose-invert">
                                                                                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                                                                    <MarkdownText content={summary.summary} />
                                                                                </div>
                                                                            </div>
                                                                            <div className="pt-3 border-t border-border/50">
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={handleGenerateSummary}
                                                                                    className="w-full gap-2"
                                                                                >
                                                                                    <RefreshCw className="h-3 w-3" />
                                                                                    Regenerate
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                                                <div className="bg-white/5 p-4 rounded-full mb-3">
                                                    <Calendar className="h-8 w-8 opacity-50" />
                                                </div>
                                                <p>No tasks scheduled</p>
                                                <Button
                                                    variant="link"
                                                    onClick={() => setIsModalOpen(true)}
                                                    className="text-primary"
                                                >
                                                    Add a task
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>



                                {/* Task Creation Modal */}
                                <TaskModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    onSubmit={handleCreateTask}
                                />
                            </div>
                        </main>

                        {/* Footer */}
                        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm py-6 mt-12 relative z-10">
                            <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-muted-foreground">© 2025 Mentora AI. All rights reserved.</p>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
                                    <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
                                    <span className="flex items-center gap-1.5 opacity-70">
                                        Powered by
                                        <span className="font-semibold text-foreground">Groq</span>
                                    </span>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    )
}
