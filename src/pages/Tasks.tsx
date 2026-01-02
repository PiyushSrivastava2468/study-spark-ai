import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  List,
  Check,
  Clock,
  Trash2,
  Edit2,
  X,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAppData } from "@/contexts/AppDataContext";
import { Task } from "@/hooks/useTasks";

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "Business Studies",
];

const priorityColors = {
  low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useAppData();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", subject: "", priority: "medium", dueDate: "" });
    setEditingTask(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.subject || !formData.dueDate) return;
    
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      subject: task.subject,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setIsDialogOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed) ||
      task.subject === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
            Tasks & Assignments
          </h1>
          <p className="text-muted-foreground">
            {tasks.filter((t) => !t.completed).length} pending tasks
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="btn-gradient rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Task title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Input
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={formData.priority} onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, priority: value })}>
                <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
              <Button onClick={handleSubmit} className="w-full btn-gradient rounded-xl">
                {editingTask ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task, index) => (
          <div key={task.id} className={cn("glass-card rounded-2xl p-5 transition-all duration-200 group", task.completed && "opacity-60")}>
            <div className="flex items-start gap-4">
              <button onClick={() => toggleTask(task.id)} className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all", task.completed ? "bg-primary border-primary" : "border-muted-foreground/30 hover:border-primary")}>
                {task.completed && <Check className="w-4 h-4 text-primary-foreground" />}
              </button>
              <div className="flex-1 min-w-0">
                <h3 className={cn("font-semibold text-foreground mb-1", task.completed && "line-through text-muted-foreground")}>{task.title}</h3>
                {task.description && <p className="text-sm text-muted-foreground mb-2">{task.description}</p>}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">{task.subject}</span>
                  <span className={cn("text-xs px-3 py-1 rounded-full border", priorityColors[task.priority])}>{task.priority}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => handleEdit(task)}><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteTask(task.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 glass-card rounded-2xl">
          <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No tasks found</p>
          <Button onClick={() => setIsDialogOpen(true)} className="btn-gradient rounded-xl">
            <Plus className="w-4 h-4 mr-2" />Add Your First Task
          </Button>
        </div>
      )}
    </div>
  );
}
