import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface StudyMaterial {
    id: string;
    user_id: string;
    type: "flashcards" | "quiz" | "notes" | "summary" | "questions" | "quickrev";
    title: string;
    content: any; // JSON or string
    created_at: string;
    tags?: string[];
}

export function useAIStudyMaterials() {
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("ai_study_materials")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setMaterials(data || []);
        } catch (err: any) {
            console.error("Error fetching materials:", err);
            // Don't show error to user immediately if it's just table missing (first run)
        } finally {
            setLoading(false);
        }
    };

    const saveMaterial = async (
        type: string,
        content: any,
        title: string = "Untitled Generation"
    ) => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("You must be logged in to save materials.");
            }

            const { data, error } = await supabase
                .from("ai_study_materials")
                .insert([
                    {
                        user_id: user.id,
                        type,
                        title,
                        content,
                        created_at: new Date().toISOString(),
                    },
                ])
                .select()
                .single();

            if (error) throw error;
            setMaterials((prev) => [data, ...prev]);
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteMaterial = async (id: string) => {
        try {
            const { error } = await supabase
                .from("ai_study_materials")
                .delete()
                .eq("id", id);

            if (error) throw error;
            setMaterials((prev) => prev.filter((m) => m.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    return {
        materials,
        loading,
        error,
        saveMaterial,
        deleteMaterial,
        refreshMaterials: fetchMaterials,
    };
}
