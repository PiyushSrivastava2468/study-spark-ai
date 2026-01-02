import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  BookOpen,
  Coffee,
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
import { useAppData } from "@/contexts/AppDataContext";
import { TimeBlock } from "@/hooks/usePlanner";

const timeSlots = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "Business Studies",
];

const typeStyles = {
  study: "bg-primary/20 border-primary/40 text-primary",
  break: "bg-accent/20 border-accent/40 text-accent",
  class: "bg-emerald-500/20 border-emerald-500/40 text-emerald-500",
  other: "bg-secondary border-border text-foreground",
};

const typeIcons = {
  study: BookOpen,
  break: Coffee,
  class: Clock,
  other: Clock,
};

export default function Planner() {
  const { blocks, addBlock, updateBlock, deleteBlock, getBlocksForDate } =
    useAppData();

  const [selectedDay, setSelectedDay] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    type: "study" as "study" | "break" | "class" | "other",
    subject: "",
  });

  const getWeekDates = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const today = new Date();
  const selectedDate = weekDates[selectedDay].toISOString().split("T")[0];
  const dayBlocks = getBlocksForDate(selectedDate);

  const resetForm = () => {
    setFormData({
      title: "",
      startTime: "09:00",
      endTime: "10:00",
      type: "study",
      subject: "",
    });
    setEditingBlock(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.startTime || !formData.endTime) return;

    if (editingBlock) {
      updateBlock(editingBlock.id, formData);
    } else {
      addBlock({
        ...formData,
        date: selectedDate,
      });
    }
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (block: TimeBlock) => {
    setEditingBlock(block);
    setFormData({
      title: block.title,
      startTime: block.startTime,
      endTime: block.endTime,
      type: block.type,
      subject: block.subject || "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
            Daily Planner
          </h1>
          <p className="text-muted-foreground">Plan your day with time blocks</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="btn-gradient rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Block
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBlock ? "Edit Time Block" : "Add Time Block"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Block title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <Select
                value={formData.type}
                onValueChange={(value: "study" | "break" | "class" | "other") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Block type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {(formData.type === "study" || formData.type === "class") && (
                <Select
                  value={formData.subject}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subject: value })
                  }
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
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full btn-gradient rounded-xl"
              >
                {editingBlock ? "Save Changes" : "Add Block"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Week Navigation */}
      <div className="glass-card rounded-2xl p-4 mb-6 animate-fade-in stagger-1 opacity-0">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentWeek);
              newDate.setDate(newDate.getDate() - 7);
              setCurrentWeek(newDate);
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h3 className="font-semibold text-foreground">
            {weekDates[0].toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentWeek);
              newDate.setDate(newDate.getDate() + 7);
              setCurrentWeek(newDate);
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDay === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={cn(
                  "flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : isToday
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary"
                )}
              >
                <span className="text-xs font-medium opacity-70">
                  {daysOfWeek[index]}
                </span>
                <span className="text-base sm:text-lg font-semibold">
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Grid */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 animate-fade-in stagger-2 opacity-0">
        <div className="relative">
          {/* Time labels */}
          <div className="absolute left-0 top-0 w-12 sm:w-16 h-full">
            {timeSlots.map((time, index) => (
              <div
                key={time}
                className="absolute text-xs text-muted-foreground -translate-y-1/2"
                style={{ top: `${(index / timeSlots.length) * 100}%` }}
              >
                {time}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="ml-14 sm:ml-20 relative" style={{ height: "800px" }}>
            {/* Hour lines */}
            {timeSlots.map((_, index) => (
              <div
                key={index}
                className="absolute left-0 right-0 border-t border-border/50"
                style={{ top: `${(index / timeSlots.length) * 100}%` }}
              />
            ))}

            {/* Time blocks */}
            {dayBlocks.map((block) => {
              const startHour = parseInt(block.startTime.split(":")[0]) - 6;
              const endHour = parseInt(block.endTime.split(":")[0]) - 6;
              const startMin = parseInt(block.startTime.split(":")[1]);
              const endMin = parseInt(block.endTime.split(":")[1]);
              const top = ((startHour + startMin / 60) / 16) * 100;
              const height =
                ((endHour - startHour + (endMin - startMin) / 60) / 16) * 100;
              const Icon = typeIcons[block.type];

              return (
                <div
                  key={block.id}
                  className={cn(
                    "absolute left-2 right-2 rounded-xl border-l-4 p-2 sm:p-3 cursor-pointer hover-lift group",
                    typeStyles[block.type]
                  )}
                  style={{ top: `${top}%`, height: `${height}%`, minHeight: "40px" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {block.title}
                        </p>
                        {block.subject && (
                          <p className="text-xs opacity-70 truncate">
                            {block.subject}
                          </p>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {block.startTime} - {block.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(block);
                        }}
                        className="p-1 rounded hover:bg-background/20"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(block.id);
                        }}
                        className="p-1 rounded hover:bg-background/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Current time indicator */}
            {selectedDay === today.getDay() - 1 && (
              <div
                className="absolute left-0 right-0 flex items-center z-10"
                style={{
                  top: `${
                    ((today.getHours() - 6 + today.getMinutes() / 60) / 16) * 100
                  }%`,
                }}
              >
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="flex-1 h-0.5 bg-destructive" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 animate-fade-in stagger-3 opacity-0 flex-wrap">
        {(["class", "study", "break"] as const).map((type) => {
          const Icon = typeIcons[type];
          return (
            <div key={type} className="flex items-center gap-2">
              <div
                className={cn("w-3 h-3 rounded", typeStyles[type].split(" ")[0])}
              />
              <span className="text-sm text-muted-foreground capitalize">
                {type}
              </span>
            </div>
          );
        })}
      </div>

      {dayBlocks.length === 0 && (
        <div className="text-center py-8 mt-6 glass-card rounded-2xl">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            No blocks scheduled for this day
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="btn-gradient rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Block
          </Button>
        </div>
      )}
    </div>
  );
}
