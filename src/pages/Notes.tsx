import { useState } from "react";
import {
  Plus,
  Search,
  Folder,
  FileText,
  Trash2,
  Edit3,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNotes, Note } from "@/hooks/useNotes";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Notes() {
  const { notes, categories, createNote, updateNote, deleteNote, addCategory, searchNotes } = useNotes();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "General" });
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  const filteredNotes = searchQuery
    ? searchNotes(searchQuery)
    : selectedCategory === "all"
    ? notes
    : notes.filter((n) => n.category === selectedCategory);

  const handleCreate = () => {
    if (!newNote.title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    createNote(newNote.title, newNote.content, newNote.category);
    setNewNote({ title: "", content: "", category: "General" });
    setIsCreating(false);
    toast({ title: "Note created" });
  };

  const handleUpdate = () => {
    if (!editingNote) return;
    updateNote(editingNote.id, {
      title: editingNote.title,
      content: editingNote.content,
      category: editingNote.category,
    });
    setEditingNote(null);
    toast({ title: "Note updated" });
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    toast({ title: "Note deleted" });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory("");
      setShowCategoryDialog(false);
      toast({ title: "Category added" });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
          Study Notes
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Organize your study materials by subject
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-secondary border-border"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48 rounded-xl bg-secondary border-border">
            <Folder className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Category</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                placeholder="Category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="rounded-xl"
              />
              <Button onClick={handleAddCategory} className="btn-gradient rounded-xl">
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button onClick={() => setIsCreating(true)} className="btn-gradient rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Create/Edit Note Modal */}
      {(isCreating || editingNote) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                {editingNote ? "Edit Note" : "Create New Note"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsCreating(false);
                  setEditingNote(null);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Note title..."
                value={editingNote ? editingNote.title : newNote.title}
                onChange={(e) =>
                  editingNote
                    ? setEditingNote({ ...editingNote, title: e.target.value })
                    : setNewNote({ ...newNote, title: e.target.value })
                }
                className="rounded-xl bg-secondary border-border text-base sm:text-lg font-medium"
              />
              <Select
                value={editingNote ? editingNote.category : newNote.category}
                onValueChange={(val) =>
                  editingNote
                    ? setEditingNote({ ...editingNote, category: val })
                    : setNewNote({ ...newNote, category: val })
                }
              >
                <SelectTrigger className="rounded-xl bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Start writing your notes..."
                value={editingNote ? editingNote.content : newNote.content}
                onChange={(e) =>
                  editingNote
                    ? setEditingNote({ ...editingNote, content: e.target.value })
                    : setNewNote({ ...newNote, content: e.target.value })
                }
                className="min-h-[200px] sm:min-h-[300px] rounded-xl bg-secondary border-border resize-none"
              />
              <Button
                onClick={editingNote ? handleUpdate : handleCreate}
                className="btn-gradient rounded-xl w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingNote ? "Save Changes" : "Create Note"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 sm:p-12 text-center animate-fade-in">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">No notes yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create your first note to start organizing your studies
          </p>
          <Button onClick={() => setIsCreating(true)} className="btn-gradient rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Create Note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note, index) => (
            <div
              key={note.id}
              className={cn(
                "glass-card rounded-2xl p-4 sm:p-5 hover-lift cursor-pointer group animate-fade-in",
                `stagger-${Math.min(index + 1, 5)}`
              )}
              style={{ opacity: 0 }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {note.category}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingNote(note)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                {note.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {note.content || "No content"}
              </p>
              <p className="text-xs text-muted-foreground">
                Updated {note.updatedAt.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
