import { useState } from "react";
import {
  Video,
  Plus,
  Play,
  Clock,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Filter,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Lecture {
  id: string;
  title: string;
  subject: string;
  description: string;
  videoUrl: string;
  duration: string;
  notes: string;
  completed: boolean;
  createdAt: Date;
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
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formSubject, setFormSubject] = useState("Other");
  const [formDescription, setFormDescription] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const resetForm = () => {
    setFormTitle("");
    setFormSubject("Other");
    setFormDescription("");
    setFormVideoUrl("");
    setFormDuration("");
    setFormNotes("");
    setShowForm(false);
    setEditingId(null);
  };

  const saveLecture = () => {
    if (!formTitle.trim()) {
      toast.error("Please enter a lecture title");
      return;
    }

    if (editingId) {
      setLectures((prev) =>
        prev.map((l) =>
          l.id === editingId
            ? {
                ...l,
                title: formTitle.trim(),
                subject: formSubject,
                description: formDescription.trim(),
                videoUrl: formVideoUrl.trim(),
                duration: formDuration.trim(),
                notes: formNotes.trim(),
              }
            : l
        )
      );
      toast.success("Lecture updated!");
    } else {
      const newLecture: Lecture = {
        id: Date.now().toString(),
        title: formTitle.trim(),
        subject: formSubject,
        description: formDescription.trim(),
        videoUrl: formVideoUrl.trim(),
        duration: formDuration.trim() || "—",
        notes: formNotes.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setLectures((prev) => [newLecture, ...prev]);
      toast.success("Lecture added!");
    }
    resetForm();
  };

  const editLecture = (lecture: Lecture) => {
    setFormTitle(lecture.title);
    setFormSubject(lecture.subject);
    setFormDescription(lecture.description);
    setFormVideoUrl(lecture.videoUrl);
    setFormDuration(lecture.duration === "—" ? "" : lecture.duration);
    setFormNotes(lecture.notes);
    setEditingId(lecture.id);
    setShowForm(true);
  };

  const deleteLecture = (id: string) => {
    setLectures((prev) => prev.filter((l) => l.id !== id));
    toast.success("Lecture deleted");
  };

  const toggleComplete = (id: string) => {
    setLectures((prev) =>
      prev.map((l) => (l.id === id ? { ...l, completed: !l.completed } : l))
    );
  };

  const filteredLectures = lectures.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "All" || l.subject === filterSubject;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && l.completed) ||
      (filterStatus === "pending" && !l.completed);
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const completedCount = lectures.filter((l) => l.completed).length;

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
                ? "Organize your lectures, video links, and notes in one place."
                : `${completedCount}/${lectures.length} completed`}
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="btn-gradient rounded-xl gap-2">
            <Plus className="w-4 h-4" />
            Add Lecture
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="glass-card rounded-2xl border border-border p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-bold text-foreground mb-4">
            {editingId ? "Edit Lecture" : "Add New Lecture"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Lecture Title *"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="input-focus"
            />
            <select
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Input
              placeholder="Video URL (YouTube, Drive, etc.)"
              value={formVideoUrl}
              onChange={(e) => setFormVideoUrl(e.target.value)}
              className="input-focus"
            />
            <Input
              placeholder="Duration (e.g., 45 min)"
              value={formDuration}
              onChange={(e) => setFormDuration(e.target.value)}
              className="input-focus"
            />
            <Textarea
              placeholder="Description or topic overview"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="input-focus sm:col-span-2"
              rows={2}
            />
            <Textarea
              placeholder="Personal notes about this lecture"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="input-focus sm:col-span-2"
              rows={2}
            />
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={saveLecture} className="btn-gradient rounded-xl gap-2">
              <Check className="w-4 h-4" />
              {editingId ? "Update" : "Save"}
            </Button>
            <Button variant="outline" onClick={resetForm} className="rounded-xl gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      )}

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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {/* Lecture List */}
      {filteredLectures.length === 0 && lectures.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 mx-auto">
            <GraduationCap className="w-10 h-10 text-primary/60" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">
            No Lectures Yet
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Add your first lecture to start organizing your study materials,
            video links, and class notes.
          </p>
          <Button onClick={() => setShowForm(true)} className="btn-gradient rounded-xl gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Lecture
          </Button>
        </div>
      ) : filteredLectures.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No lectures match your search/filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLectures.map((lecture) => {
            const colorClass = SUBJECT_COLORS[lecture.subject] || SUBJECT_COLORS["Other"];
            return (
              <div
                key={lecture.id}
                className={cn(
                  "group rounded-2xl border p-5 transition-all duration-300 hover:shadow-md bg-gradient-to-br",
                  colorClass,
                  lecture.completed && "opacity-70"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleComplete(lecture.id)}
                    className={cn(
                      "mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                      lecture.completed
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30 hover:border-primary"
                    )}
                  >
                    {lecture.completed && <Check className="w-4 h-4" />}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground font-medium">
                        {lecture.subject}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lecture.duration}
                      </span>
                    </div>
                    <h3
                      className={cn(
                        "text-lg font-bold text-foreground",
                        lecture.completed && "line-through"
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

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {lecture.videoUrl && (
                      <a
                        href={lecture.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-background/80 transition-colors text-primary"
                        title="Open Video"
                      >
                        <Play className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => editLecture(lecture)}
                      className="p-2 rounded-lg hover:bg-background/80 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteLecture(lecture.id)}
                      className="p-2 rounded-lg hover:bg-background/80 transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
