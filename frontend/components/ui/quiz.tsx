
import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface QuizItem {
    question: string;
    answer: string;
}

interface QuizProps {
    questions: QuizItem[];
}

export function Quiz({ questions }: QuizProps) {
    const [revealed, setRevealed] = useState<boolean[]>(new Array(questions.length).fill(false));

    const toggleReveal = (index: number) => {
        const newRevealed = [...revealed];
        newRevealed[index] = !newRevealed[index];
        setRevealed(newRevealed);
    };

    const allRevealed = revealed.every(Boolean);

    return (
        <div className="space-y-6 my-4 w-full">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Knowledge Check</h3>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                    {questions.length} Questions
                </span>
            </div>

            <div className="space-y-4">
                {questions.map((item, index) => (
                    <div key={index} className="rounded-xl border border-border/50 bg-card overflow-hidden transition-all hover:border-primary/20">
                        <div className="p-4 bg-muted/20 border-b border-border/50">
                            <h4 className="font-medium text-sm text-foreground mb-1">Question {index + 1}</h4>
                            <p className="text-sm leading-relaxed">{item.question}</p>
                        </div>

                        <div className="p-4 bg-card/50">
                            {revealed[index] ? (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-foreground/90">{item.answer}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleReveal(index)}
                                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        <EyeOff className="w-3 h-3 mr-1.5" />
                                        Hide Answer
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => toggleReveal(index)}
                                    className="w-full h-9 bg-secondary/50 hover:bg-secondary text-secondary-foreground"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Reveal Answer
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {allRevealed && (
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20 animate-in zoom-in-95 duration-300">
                    <p className="text-sm text-green-600 font-medium">Great job! You've reviewed all questions.</p>
                </div>
            )}
        </div>
    );
}
