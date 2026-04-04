import { useState, useEffect } from "react";
import {
  Video,
  Play,
  Clock,
  Search,
  GraduationCap,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Lecture {
  id: string;
  title: string;
  subject: string;
  description: string;
  video_url: string;
  duration: string;
  notes: string;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
  Physics: "from-orange-500/10 to-amber-500/10 border-orange-500/20",
  Chemistry: "from-green-500/10 to-emerald-500/10 border-green-500/20",
  Biology: "from-rose-500/10 to-pink-500/10 border-rose-500/20",
  "Computer Science": "from-violet-500/10 to-purple-500/10 border-violet-500/20",
  English: "from-yellow-500/10 to-orange-500/10 border-yellow-500/20",
  History: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
  Other: "from-slate-500/10 to-gray-500/10 border-slate-500/20",
};

const SUBJECTS = Object.keys(SUBJECT_COLORS);

export default function Lectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // Load completed lectures from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("completed_lectures");
    if (saved) {
      try {
        setCompletedIds(JSON.parse(saved));
      } catch { }
    }
  }, []);

  // Fetch lectures from Supabase
  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLectures(data || []);
    } catch (err: any) {
      console.error("Error fetching lectures:", err);
      // Don't show error on first load if table doesn't exist yet
      if (!err.message?.includes("does not exist")) {
        toast.error("Failed to load lectures");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("completed_lectures", JSON.stringify(next));
      return next;
    });
  };

  const filteredLectures = lectures.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "All" || l.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const completedCount = lectures.filter((l) => completedIds.includes(l.id)).length;

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">Study Material</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              Lectures
            </h1>
            <p className="text-muted-foreground">
              {lectures.length === 0
                ? "Lectures uploaded by your institution will appear here."
                : `${completedCount}/${lectures.length} completed`}
            </p>
          </div>
          {lectures.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-semibold">{lectures.length} Lectures Available</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      {lectures.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search lectures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 input-focus"
            />
          </div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm min-w-[140px]"
          >
            <option value="All">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading lectures...</p>
        </div>
      ) : filteredLectures.length === 0 && lectures.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 mx-auto">
            <GraduationCap className="w-10 h-10 text-primary/60" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">
            No Lectures Yet
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Your institution hasn't uploaded any lectures yet. Check back later
            for study materials, video lectures, and course content.
          </p>
        </div>
      ) : filteredLectures.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No lectures match your search/filters.
        </div>
      ) : (
        /* Lecture List */
        <div className="space-y-4">
          {filteredLectures.map((lecture) => {
            const colorClass = SUBJECT_COLORS[lecture.subject] || SUBJECT_COLORS["Other"];
            const isCompleted = completedIds.includes(lecture.id);
            return (
              <div
                key={lecture.id}
                className={cn(
                  "group rounded-2xl border p-5 transition-all duration-300 hover:shadow-md bg-gradient-to-br",
                  colorClass,
                  isCompleted && "opacity-70"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Completion Toggle */}
                  <button
                    onClick={() => toggleComplete(lecture.id)}
                    className={cn(
                      "mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30 hover:border-primary"
                    )}
                    title={isCompleted ? "Mark as not completed" : "Mark as completed"}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground font-medium">
                        {lecture.subject}
                      </span>
                      {lecture.duration && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lecture.duration}
                        </span>
                      )}
                    </div>
                    <h3
                      className={cn(
                        "text-lg font-bold text-foreground",
                        isCompleted && "line-through"
                      )}
                    >
                      {lecture.title}
                    </h3>
                    {lecture.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {lecture.description}
                      </p>
                    )}
                    {lecture.notes && (
                      <div className="mt-2 p-2 rounded-lg bg-background/50 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/80">Notes: </span>
                        {lecture.notes}
                      </div>
                    )}
                  </div>

                  {/* Watch Button */}
                  <div className="flex items-center gap-1 shrink-0">
                    {lecture.video_url && (
                      <a
                        href={lecture.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium"
                        title="Watch Lecture"
                      >
                        <Play className="w-4 h-4" />
                        Watch
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
