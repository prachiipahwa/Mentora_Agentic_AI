import Link from "next/link"
import { ArrowRight, FileSearch, Calendar, BookOpen, Brain, Sparkles, CheckCircle2 } from "lucide-react"

const features = [
    { icon: FileSearch, label: "Document Q&A", desc: "Interact with your PDFs instantly" },
    { icon: Calendar, label: "Smart Calendar", desc: "Auto-scheduled study sessions" },
    { icon: BookOpen, label: "Study Plans", desc: "AI-generated curriculums" },
    { icon: Brain, label: "AI Summaries", desc: "Complex topics simplified" },
]

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="text-left space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider backdrop-blur-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>AI-Powered Learning Platform</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-[1.1]">
                        Master any subject <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                            with Mentora
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground/80 max-w-xl leading-relaxed">
                        Your intelligent study companion that turns complex documents into clear answers,
                        organized plans, and efficient schedules.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-lg font-medium rounded-2xl hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                        >
                            Start Learning
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="#features"
                            className="inline-flex items-center gap-2 px-8 py-4 border border-border/50 bg-background/50 backdrop-blur-sm text-foreground text-lg font-medium rounded-2xl hover:bg-accent/50 transition-colors"
                        >
                            View Features
                        </Link>
                    </div>

                    <div className="flex items-center gap-8 pt-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold ring-2 ring-primary/20">
                                    <span className="sr-only">User {i}</span>
                                    {/* Placeholder avatars */}
                                    <div className={`w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-400`} />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-background bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold ring-2 ring-primary/20">
                                +2k
                            </div>
                        </div>
                        <div className="text-sm">
                            <div className="flex items-center gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 fill-current">★</div>)}
                            </div>
                            <span className="text-muted-foreground">Loved by students worldwide</span>
                        </div>
                    </div>
                </div>

                {/* Hero Feature Grid (Bento Style) */}
                <div className="relative">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl hover:scale-[1.02] transition-transform duration-500 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium bg-white/5 px-2 py-1 rounded-full text-muted-foreground">AI Analysis</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Deep Understanding</h3>
                            <p className="text-muted-foreground text-sm mb-4">Upload complex PDFs and get instant, accurate answers with citations.</p>
                            <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-[85%] group-hover:w-[95%] transition-all duration-1000" />
                            </div>
                        </div>

                        <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 w-fit mb-4">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-1">Smart Plan</h3>
                            <div className="space-y-2 mt-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                    <span>Schedule created</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                    <span>Reminders set</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
                            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 w-fit mb-4">
                                <FileSearch className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-1">RAG Search</h3>
                            <div className="mt-3 bg-black/20 rounded-lg p-2 text-[10px] font-mono text-muted-foreground opacity-70">
                                &gt; Searching docs...<br />
                                &gt; Found 3 citations
                            </div>
                        </div>
                    </div>

                    {/* Floating Decoration */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                </div>
            </div>
        </section>
    )
}
