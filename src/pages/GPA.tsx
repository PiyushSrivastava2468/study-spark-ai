import { useState } from "react";
import { Plus, Trash2, GraduationCap, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const gradePoints: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

const grades = Object.keys(gradePoints);

export default function GPA() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Calculus II", credits: 4, grade: "A" },
    { id: "2", name: "Physics I", credits: 3, grade: "B+" },
    { id: "3", name: "Computer Science 101", credits: 3, grade: "A-" },
  ]);
  const [targetGPA, setTargetGPA] = useState("3.5");

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Date.now().toString(), name: "", credits: 3, grade: "A" },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const calculateGPA = () => {
    if (courses.length === 0) return 0;
    const totalPoints = courses.reduce(
      (sum, course) => sum + gradePoints[course.grade] * course.credits,
      0
    );
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const gpa = calculateGPA();
  const gpaNum = parseFloat(String(gpa));
  const targetNum = parseFloat(targetGPA);
  const gpaProgress = (gpaNum / 4.0) * 100;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          GPA Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate and track your academic performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="stat-card relative overflow-hidden animate-fade-in stagger-1 opacity-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Current GPA
            </h3>
            <p className="text-4xl font-display font-bold text-foreground">{gpa}</p>
            <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${gpaProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="stat-card relative overflow-hidden animate-fade-in stagger-2 opacity-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent/5" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Target className="w-5 h-5 text-accent" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Target GPA
            </h3>
            <Input
              type="number"
              value={targetGPA}
              onChange={(e) => setTargetGPA(e.target.value)}
              step="0.1"
              min="0"
              max="4"
              className="text-3xl font-display font-bold h-auto p-0 border-0 bg-transparent focus-visible:ring-0"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {gpaNum >= targetNum ? (
                <span className="text-emerald-500">On track! ✓</span>
              ) : (
                <span className="text-destructive">
                  {(targetNum - gpaNum).toFixed(2)} points to go
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="stat-card relative overflow-hidden animate-fade-in stagger-3 opacity-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Credits
            </h3>
            <p className="text-4xl font-display font-bold text-foreground">
              {totalCredits}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {courses.length} courses
            </p>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-4 opacity-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Courses</h3>
          <Button onClick={addCourse} variant="outline" className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>

        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Course Name</div>
            <div className="col-span-2 text-center">Credits</div>
            <div className="col-span-3 text-center">Grade</div>
            <div className="col-span-2 text-center">Points</div>
          </div>

          {/* Courses */}
          {courses.map((course, index) => (
            <div
              key={course.id}
              className={cn(
                "grid grid-cols-12 gap-4 items-center p-4 rounded-xl bg-secondary/50 group animate-fade-in opacity-0"
              )}
              style={{ animationDelay: `${(index + 5) * 50}ms` }}
            >
              <div className="col-span-5">
                <Input
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  placeholder="Course name"
                  className="bg-background input-focus"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  value={course.credits}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateCourse(course.id, "credits", isNaN(val) ? 1 : val);
                  }}
                  min={1}
                  max={6}
                  className="bg-background text-center input-focus"
                />
              </div>
              <div className="col-span-3">
                <Select
                  value={course.grade}
                  onValueChange={(value) => updateCourse(course.id, "grade", value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade} ({gradePoints[grade].toFixed(1)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <span className="font-semibold text-foreground">
                  {(gradePoints[course.grade] * course.credits).toFixed(1)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCourse(course.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No courses added yet. Click "Add Course" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
