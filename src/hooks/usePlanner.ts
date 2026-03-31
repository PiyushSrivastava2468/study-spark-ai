import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

export function usePlanner() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBlocks([]);
      return;
    }
    fetchBlocks();
  }, [user]);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("time_blocks")
        .select("*");
      //.eq('date', date) // Could filter by date if passed, but typically we load all or range

      if (error) throw error;

      if (data) {
        setBlocks(data.map((b: any) => ({
          id: b.id,
          title: b.title,
          startTime: b.start_time,
          endTime: b.end_time,
          type: b.type,
          subject: b.subject,
          date: b.date,
          createdAt: new Date(b.created_at),
          updatedAt: new Date(b.updated_at),
        })));
      }
    } catch (error: any) {
      console.error("Error fetching blocks:", error);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const addBlock = async (block: Omit<TimeBlock, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (!user) return;

      const newBlockData = {
        user_id: user.id,
        title: block.title,
        start_time: block.startTime,
        end_time: block.endTime,
        type: block.type,
        subject: block.subject,
        date: block.date,
      };

      const { data, error } = await supabase
        .from("time_blocks")
        .insert(newBlockData)
        .select()
        .single();

      if (error) throw error;

      const newBlock: TimeBlock = {
        id: data.id,
        title: data.title,
        startTime: data.start_time,
        endTime: data.end_time,
        type: data.type,
        subject: data.subject,
        date: data.date,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setBlocks((prev) => [...prev, newBlock]);
      return newBlock;
    } catch (error: any) {
      console.error("Error adding block:", error);
      toast.error("Failed to add block");
    }
  };

  const updateBlock = async (id: string, updates: Partial<Omit<TimeBlock, "id" | "createdAt">>) => {
    try {
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === id ? { ...block, ...updates, updatedAt: new Date() } : block
        )
      );

      const apiUpdates: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title) apiUpdates.title = updates.title;
      if (updates.startTime) apiUpdates.start_time = updates.startTime;
      if (updates.endTime) apiUpdates.end_time = updates.endTime;
      if (updates.type) apiUpdates.type = updates.type;
      if (updates.subject) apiUpdates.subject = updates.subject;
      if (updates.date) apiUpdates.date = updates.date;

      const { error } = await supabase
        .from("time_blocks")
        .update(apiUpdates)
        .eq("id", id);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating block:", error);
      toast.error("Failed to update block");
      fetchBlocks();
    }
  };

  const deleteBlock = async (id: string) => {
    try {
      setBlocks((prev) => prev.filter((block) => block.id !== id));
      const { error } = await supabase.from("time_blocks").delete().eq("id", id);
      if (error) throw error;
    } catch (error: any) {
      console.error("Error deleting block:", error);
      toast.error("Failed to delete block");
      fetchBlocks();
    }
  };

  const getBlocksForDate = (date: string) => {
    return blocks.filter((b) => b.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return {
    blocks,
    loading,
    addBlock,
    updateBlock,
    deleteBlock,
    getBlocksForDate,
  };
}
