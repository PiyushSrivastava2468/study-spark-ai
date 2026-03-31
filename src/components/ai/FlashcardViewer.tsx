import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Flashcard {
    front: string;
    back: string;
}

interface FlashcardViewerProps {
    data: Flashcard[];
}

export function FlashcardViewer({ data }: FlashcardViewerProps) {
    const [currentindex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (!data || data.length === 0) return <div className="text-center p-4">No flashcards data found.</div>;

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % data.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
    };

    const handleFlip = () => setIsFlipped(!isFlipped);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl mx-auto p-4">
            <div className="mb-4 text-sm text-muted-foreground font-medium">
                Card {currentindex + 1} of {data.length}
            </div>

            <div
                className="relative w-full h-[400px] cursor-pointer perspective-1000 group"
                onClick={handleFlip}
            >
                <div className={cn(
                    "w-full h-full transition-all duration-500 preserve-3d shadow-xl rounded-2xl border border-primary/20 bg-card",
                    isFlipped ? "my-rotate-y-180" : ""
                )}>
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden flex flex-col p-6 text-center bg-gradient-to-br from-background to-secondary/30 rounded-2xl overflow-hidden">
                        <div className="flex-1 w-full overflow-y-auto scrollbar-hide flex flex-col items-center justify-center">
                            <h3 className="text-xl md:text-2xl font-semibold text-foreground w-full">
                                {data[currentindex].front}
                            </h3>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 uppercase tracking-wider shrink-0">Tap to Flip</p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden my-rotate-y-180 flex flex-col p-6 text-center bg-primary/5 rounded-2xl border-2 border-primary/20 overflow-hidden">
                        <div className="flex-1 w-full overflow-y-auto scrollbar-hide flex flex-col items-center justify-center">
                            <p className="text-lg md:text-xl text-foreground leading-relaxed w-full">
                                {data[currentindex].back}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
                <Button variant="outline" size="icon" onClick={handlePrev}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="default" className="gap-2" onClick={handleFlip}>
                    <RotateCw className="w-4 h-4" />
                    Flip Card
                </Button>
                <Button variant="outline" size="icon" onClick={handleNext}>
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
