
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/ui/markdown-text";

interface Flashcard {
    question: string;
    answer: string;
}

interface FlashcardDeckProps {
    cards: Flashcard[];
}

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    };

    const currentCard = cards[currentIndex];

    return (
        <div className="w-full max-w-lg mx-auto my-4">
            <div
                className="relative h-64 w-full cursor-pointer perspective-1000 group"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={`relative h-full w-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Front */}
                    <div className="absolute inset-0 h-full w-full backface-hidden rounded-xl border border-primary/20 bg-card p-8 flex flex-col items-center justify-center text-center shadow-lg">
                        <span className="text-xs font-semibold text-primary mb-4 uppercase tracking-wider">Question {currentIndex + 1}/{cards.length}</span>
                        <p className="text-lg font-medium">{currentCard.question}</p>
                        <p className="text-xs text-muted-foreground mt-6 absolute bottom-6 flex items-center gap-1">
                            <RotateCw className="w-3 h-3" /> Click to flip
                        </p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 h-full w-full backface-hidden rotate-y-180 rounded-xl border border-primary/20 bg-primary/5 p-8 flex flex-col items-center justify-center text-center shadow-lg">
                        <span className="text-xs font-semibold text-primary mb-4 uppercase tracking-wider">Answer</span>
                        <div className="text-base text-foreground/90 text-left w-full h-full overflow-y-auto">
                            <MarkdownText content={currentCard.answer} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrev}
                    disabled={cards.length <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-muted-foreground">
                    {currentIndex + 1} / {cards.length}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    disabled={cards.length <= 1}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
