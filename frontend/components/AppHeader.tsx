"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, FileText, Calendar, MessageSquare, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
    { href: "/docs", label: "Docs", icon: FileText },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/study-plan", label: "Study Plans", icon: BookOpen },
]

interface AppHeaderProps {
    maxWidth?: "4xl" | "6xl" | "7xl"
}

export function AppHeader({ maxWidth = "6xl" }: AppHeaderProps) {
    const pathname = usePathname()

    const maxWidthClass = {
        "4xl": "max-w-4xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
    }[maxWidth]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className={cn("mx-auto px-6 h-16 flex items-center justify-between", maxWidthClass)}>
                {/* Logo / Brand */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">Mentora</h1>
                        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Not just a mentor - Your multi-agent study navigator.</p>
                    </div>
                </Link>

                {/* Navigation Links */}
                <nav className="flex items-center gap-1 bg-secondary/30 p-1 rounded-xl border border-white/5">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                                    isActive
                                        ? "text-primary bg-background shadow-sm ring-1 ring-white/5"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                <link.icon className={cn("w-4 h-4 transition-transform duration-300", isActive && "scale-110")} />
                                <span>{link.label}</span>
                                {isActive && (
                                    <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}
