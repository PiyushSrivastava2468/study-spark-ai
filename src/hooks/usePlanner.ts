import { useState, useEffect } from "react";

export interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: "study" | "break" | "class" | "other";
  subject?: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = "focusflow-planner";

export function usePlanner() {
  const [blocks, setBlocks] = useState<TimeBlock[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((b: any) => ({
        ...b,
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt),
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
  }, [blocks]);

  const addBlock = (block: Omit<TimeBlock, "id" | "createdAt" | "updatedAt">) => {
    const newBlock: TimeBlock = {
      ...block,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBlocks((prev) => [...prev, newBlock]);
    return newBlock;
  };

  const updateBlock = (id: string, updates: Partial<Omit<TimeBlock, "id" | "createdAt">>) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, ...updates, updatedAt: new Date() } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  const getBlocksForDate = (date: string) => {
    return blocks.filter((b) => b.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return {
    blocks,
    addBlock,
    updateBlock,
    deleteBlock,
    getBlocksForDate,
  };
}
