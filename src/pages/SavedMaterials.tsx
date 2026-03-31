import { useEffect } from "react";
import { useAIStudyMaterials, StudyMaterial } from "@/hooks/useAIStudyMaterials";
import { Brain, FileText, List, Zap, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AIResultViewer } from "@/components/ai/AIResultViewer";

const featureIcons: Record<string, any> = {
    flashcards: Zap,
    quiz: Brain,
    notes: FileText,
    summary: List,
    questions: Brain,
    quickrev: Zap,
};

export default function SavedMaterials() {
    const { materials, loading, refreshMaterials, deleteMaterial } = useAIStudyMaterials();
    const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);

    useEffect(() => {
        refreshMaterials();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this item?")) {
            await deleteMaterial(id);
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">My Library</h1>
                <p className="text-muted-foreground">Your collection of AI-generated study materials.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : materials.length === 0 ? (
                <div className="text-center py-20 bg-secondary/10 rounded-2xl border-2 border-dashed border-border">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium text-foreground mb-2">Library is Empty</h3>
                    <p className="text-muted-foreground">Generated content you save will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((item) => {
                        const Icon = featureIcons[item.type] || FileText;
                        return (
                            <div
                                key={item.id}
                                onClick={() => setSelectedMaterial(item)}
                                className="group relative bg-card hover:bg-secondary/50 border border-border rounded-xl p-5 transition-all duration-300 hover:shadow-lg cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => handleDelete(e, item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{item.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="capitalize bg-secondary px-2 py-0.5 rounded-md border">{item.type}</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedMaterial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
                    {/* Reuse AIResultViewer but need to mock onClose to clear selection */}
                    <div className="w-full max-w-5xl h-full max-h-[90vh]">
                        <AIResultViewer
                            result={typeof selectedMaterial.content === 'string' ? selectedMaterial.content : JSON.stringify(selectedMaterial.content)}
                            featureId={selectedMaterial.type}
                            onClose={() => setSelectedMaterial(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
