import { useState } from "react";
import { Maximize2, Minimize2, X, Copy, Check, Brain, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { FlashcardViewer } from "@/components/ai/FlashcardViewer";
import { QuizViewer } from "@/components/ai/QuizViewer";
import { useAIStudyMaterials } from "@/hooks/useAIStudyMaterials";
import { toast } from "sonner"; // Assuming sonner or similar toast exists, otherwise console.log/alert

interface AIResultViewerProps {
    result: string;
    onClose: () => void;
    featureId: string;
}

export function AIResultViewer({ result, onClose, featureId }: AIResultViewerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const { saveMaterial, loading } = useAIStudyMaterials();
    const [isSaving, setIsSaving] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Basic implementation: Use functionality name + timestamp as default title
            const title = `${featureId.charAt(0).toUpperCase() + featureId.slice(1)} - ${new Date().toLocaleDateString()}`;
            await saveMaterial(featureId, result, title);
            setCopied(true); // Reusing check icon state for visual feedback
            setTimeout(() => setCopied(false), 2000);
            // alert("Saved successfully!"); 
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save. Make sure you are logged in and the database table exists.");
        } finally {
            setIsSaving(false);
        }
    };

    const safeJsonParse = (str: string) => {
        try {
            const clean = str.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(clean);
        } catch (e) {
            return null;
        }
    };

    const parsedData = (featureId === "flashcards" || featureId === "quiz" || featureId === "questions") ? safeJsonParse(result) : null;
    const isJson = !!parsedData;

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div
            className={cn(
                "bg-background/95 backdrop-blur-md border border-border shadow-2xl transition-all duration-300 ease-in-out z-50",
                isExpanded
                    ? "fixed inset-0 z-[100] h-screen w-screen rounded-none"
                    : "glass-card rounded-2xl sticky top-8 max-h-[calc(100vh-100px)]"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                        <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">AI Output</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving || loading} className="h-8 w-8 text-muted-foreground hover:text-primary">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleExpand} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className={cn("p-6 overflow-y-auto scrollbar-hide", isExpanded ? "h-[calc(100vh-70px)]" : "max-h-[600px]")}>
                <div className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {isJson ? (
                        featureId === "flashcards" ? (
                            <FlashcardViewer data={parsedData} />
                        ) : featureId === "quiz" ? (
                            <QuizViewer data={parsedData} />
                        ) : (
                            // Default JSON view for questions or other structured data
                            <pre className="bg-secondary/50 p-4 rounded-xl font-mono text-xs overflow-auto border border-border">
                                {JSON.stringify(parsedData, null, 2)}
                            </pre>
                        )
                    ) : (
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 text-foreground" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-3 text-foreground mt-6" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />,
                                li: ({ node, ...props }) => <li className="text-muted-foreground" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-4 text-muted-foreground leading-relaxed" {...props} />,
                            }}
                        >
                            {result}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
        </div >
    );
}
