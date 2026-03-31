import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const defaultCategories = ["General", "Math", "Science", "History", "English", "Computer Science"];

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setNotes(data.map((n: any) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          category: n.category,
          createdAt: new Date(n.created_at),
          updatedAt: new Date(n.updated_at),
        })));

        // Extract unique categories from notes and merge with defaults
        const noteCategories = new Set(data.map((n: any) => n.category));
        const mergedCategories = Array.from(new Set([...defaultCategories, ...Array.from(noteCategories)]));
        setCategories(mergedCategories);
      }
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (title: string, content: string, category: string): Promise<Note | undefined> => {
    try {
      if (!user) return;

      const newNoteData = {
        user_id: user.id,
        title,
        content,
        category,
      };

      const { data, error } = await supabase
        .from("notes")
        .insert(newNoteData)
        .select()
        .single();

      if (error) throw error;

      const newNote: Note = {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (error: any) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  const updateNote = async (id: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => {
    try {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
        )
      );

      const apiUpdates: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title) apiUpdates.title = updates.title;
      if (updates.content) apiUpdates.content = updates.content;
      if (updates.category) apiUpdates.category = updates.category;

      const { error } = await supabase
        .from("notes")
        .update(apiUpdates)
        .eq("id", id);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
      fetchNotes();
    }
  };

  const deleteNote = async (id: string) => {
    try {
      setNotes((prev) => prev.filter((note) => note.id !== id));
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
    } catch (error: any) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
      fetchNotes();
    }
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
    }
  };

  const searchNotes = (query: string): Note[] => {
    const lowerQuery = query.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery) ||
        note.category.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    notes,
    categories,
    loading,
    createNote,
    updateNote,
    deleteNote,
    addCategory,
    searchNotes,
  };
}
