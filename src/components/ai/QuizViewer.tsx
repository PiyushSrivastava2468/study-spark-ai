import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RefreshCw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // Verify if API returns index (number) or string
    explanation?: string;
}

interface QuizViewerProps {
    data: QuizQuestion[];
}

export function QuizViewer({ data }: QuizViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    if (!data || data.length === 0) return <div className="text-center p-4">No quiz data found.</div>;

    const currentQuestion = data[currentIndex];

    const handleOptionClick = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
        if (index === currentQuestion.correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowScore(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setScore(0);
        setShowScore(false);
        setSelectedOption(null);
        setIsAnswered(false);
    };

    if (showScore) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 animate-in zoom-in-50">
                <Trophy className="w-20 h-20 text-yellow-500 mb-6" />
                <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-xl text-muted-foreground mb-8">
                    You scored <span className="text-primary font-bold">{score}</span> out of <span className="text-foreground">{data.length}</span>
                </p>
                <Button onClick={handleRestart} size="lg" className="gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 w-full">
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium text-muted-foreground">
                    Question {currentIndex + 1} / {data.length}
                </span>
                <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full">
                    Score: {score}
                </span>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-6 leading-relaxed">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        let stateClass = "";
                        if (isAnswered) {
                            if (idx === currentQuestion.correctAnswer) stateClass = "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400";
                            else if (idx === selectedOption) stateClass = "bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-400";
                            else stateClass = "opacity-50";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(idx)}
                                disabled={isAnswered}
                                className={cn(
                                    "w-full text-left p-4 rounded-lg border transition-all duration-200",
                                    stateClass ? stateClass : "hover:bg-secondary hover:border-primary/50",
                                    !isAnswered && selectedOption === idx && "bg-primary/10 border-primary"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {isAnswered && idx === currentQuestion.correctAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                                    {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {isAnswered && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    {currentQuestion.explanation && (
                        <div className="bg-blue-500/10 text-blue-700 dark:text-blue-300 p-4 rounded-lg text-sm border border-blue-500/20">
                            <strong>Explanation:</strong> {currentQuestion.explanation}
                        </div>
                    )}
                    <Button onClick={handleNext} className="w-full" size="lg">
                        {currentIndex < data.length - 1 ? "Next Question" : "See Results"}
                    </Button>
                </div>
            )}
        </div>
    );
}
