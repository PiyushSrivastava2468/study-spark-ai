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

interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
}

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "Business Studies",
];

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete Calculus Assignment",
    description: "Chapter 5 problems 1-20",
    subject: "Mathematics",
    priority: "high",
    dueDate: "2024-12-20",
    completed: false,
  },
  {
    id: "2",
    title: "Read Chapter 5 - Organic Chemistry",
    subject: "Chemistry",
    priority: "medium",
    dueDate: "2024-12-21",
    completed: false,
  },
  {
    id: "3",
    title: "Physics Lab Report",
    description: "Motion and Forces experiment",
    subject: "Physics",
    priority: "high",
    dueDate: "2024-12-19",
    completed: true,
  },
  {
    id: "4",
    title: "Data Structures Review",
    subject: "Computer Science",
    priority: "low",
    dueDate: "2024-12-25",
    completed: false,
  },
];

const priorityColors = {
  low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    subject: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  });

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const addTask = () => {
    if (!newTask.title || !newTask.subject || !newTask.dueDate) return;
    
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
    };
    setTasks((prev) => [task, ...prev]);
    setNewTask({
      title: "",
      description: "",
      subject: "",
      priority: "medium",
      dueDate: "",
    });
    setIsDialogOpen(false);
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
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Tasks & Assignments
          </h1>
          <p className="text-muted-foreground">
            {tasks.filter((t) => !t.completed).length} pending tasks
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="input-focus"
              />
              <Input
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="input-focus"
              />
              <Select
                value={newTask.subject}
                onValueChange={(value) => setNewTask({ ...newTask, subject: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={newTask.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setNewTask({ ...newTask, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="input-focus"
              />
              <Button onClick={addTask} className="w-full btn-gradient rounded-xl">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in stagger-1 opacity-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 input-focus"
          />
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
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setView("list")}
            className={cn(
              "px-4 py-2 transition-colors",
              view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("calendar")}
            className={cn(
              "px-4 py-2 transition-colors",
              view === "calendar" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task, index) => (
          <div
            key={task.id}
            className={cn(
              "glass-card rounded-2xl p-5 transition-all duration-200 group animate-fade-in opacity-0",
              task.completed && "opacity-60"
            )}
            style={{ animationDelay: `${(index + 2) * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                  task.completed
                    ? "bg-primary border-primary"
                    : "border-muted-foreground/30 hover:border-primary"
                )}
              >
                {task.completed && <Check className="w-4 h-4 text-primary-foreground" />}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-semibold text-foreground mb-1",
                    task.completed && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {task.subject}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border",
                      priorityColors[task.priority]
                    )}
                  >
                    {task.priority}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found</p>
        </div>
      )}
    </div>
  );
}
