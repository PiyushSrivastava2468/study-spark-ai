import { useState, useEffect, useMemo } from "react";

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
  const [notes, setNotes] = useState<Note[]>(() => {
    const stored = localStorage.getItem("focusflow-notes");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      }));
    }
    return [];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const stored = localStorage.getItem("focusflow-note-categories");
    return stored ? JSON.parse(stored) : defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem("focusflow-notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("focusflow-note-categories", JSON.stringify(categories));
  }, [categories]);

  const createNote = (title: string, content: string, category: string): Note => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
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
    createNote,
    updateNote,
    deleteNote,
    addCategory,
    searchNotes,
  };
}
