import { useState } from "react";
import {
  Brain,
  FileText,
  Upload,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Layers,
  Clock,
  Send,
  Image,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const aiFeatures = [
  {
    id: "summary",
    label: "Smart Summary",
    icon: FileText,
    description: "Get concise summaries of your study material",
    color: "primary",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    icon: Layers,
    description: "Auto-generate flashcards from your notes",
    color: "accent",
  },
  {
    id: "quiz",
    label: "Quiz Me",
    icon: HelpCircle,
    description: "Test your knowledge with AI-generated quizzes",
    color: "warm",
  },
  {
    id: "questions",
    label: "Important Questions",
    icon: Lightbulb,
    description: "Get likely exam questions for your topic",
    color: "success",
  },
  {
    id: "notes",
    label: "Revision Notes",
    icon: BookOpen,
    description: "Create structured revision notes",
    color: "primary",
  },
  {
    id: "quickrev",
    label: "5-Min Revision",
    icon: Clock,
    description: "Quick revision before your exam",
    color: "accent",
  },
];

const difficultyLevels = ["School", "College", "Competitive"];

export default function AIHub() {
  const [inputText, setInputText] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("summary");
  const [difficulty, setDifficulty] = useState("College");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setResult(`Here's your ${selectedFeature} for the topic:\n\n${inputText}\n\nThis is a demo result. Connect to Lovable Cloud to enable real AI-powered study assistance!`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered</span>
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-3">
          AI Study Hub
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your study material into summaries, flashcards, quizzes, and more with the power of AI
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-fade-in stagger-1 opacity-0">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              const isSelected = selectedFeature === feature.id;
              return (
                <button
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature.id)}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all hover-lift",
                    isSelected
                      ? "bg-primary/10 border-primary/30 shadow-glow"
                      : "glass-card hover:border-primary/20"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-secondary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">
                    {feature.label}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {feature.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-2 opacity-0">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="text" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="upload" className="gap-2">
                  <Upload className="w-4 h-4" />
                  PDF
                </TabsTrigger>
                <TabsTrigger value="image" className="gap-2">
                  <Image className="w-4 h-4" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="voice" className="gap-2">
                  <Mic className="w-4 h-4" />
                  Voice
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-0">
                <Textarea
                  placeholder="Paste your notes, enter a topic, or describe what you want to study..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-none input-focus text-base"
                />
              </TabsContent>

              <TabsContent value="upload" className="mt-0">
                <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium text-foreground mb-1">Drop your PDF here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
              </TabsContent>

              <TabsContent value="image" className="mt-0">
                <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Image className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium text-foreground mb-1">Upload handwritten notes</p>
                  <p className="text-sm text-muted-foreground">We'll extract text using OCR</p>
                </div>
              </TabsContent>

              <TabsContent value="voice" className="mt-0">
                <div className="border-2 border-dashed border-border rounded-xl p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium text-foreground mb-1">Click to start recording</p>
                  <p className="text-sm text-muted-foreground">Speak your notes or topic</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleGenerate}
                disabled={!inputText.trim() || isProcessing}
                className="btn-gradient rounded-xl px-6"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in stagger-3 opacity-0">
          <div className="glass-card rounded-2xl p-6 sticky top-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">AI Output</h3>
            </div>

            {result ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-foreground whitespace-pre-wrap">{result}</p>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Enter your study material and click Generate to see AI-powered results here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
