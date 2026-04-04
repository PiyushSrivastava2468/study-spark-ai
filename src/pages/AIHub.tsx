import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Image as ImageIcon,
  Mic,
  Loader2,
  StopCircle,
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
import { generateStudyContent, type AIFeatureId } from "@/lib/openai";
import { extractTextFromPDF, extractTextFromImage } from "@/lib/file-utils";
import { toast } from "sonner";
import { AIResultViewer } from "@/components/ai/AIResultViewer";

const aiFeatures: { id: AIFeatureId; label: string; icon: any; description: string; color: string }[] = [
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
  const [selectedFeature, setSelectedFeature] = useState<AIFeatureId>("summary");
  const [difficulty, setDifficulty] = useState("College");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // File handling state
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      let text = "";
      if (type === 'pdf') {
        text = await extractTextFromPDF(file);
      } else {
        text = await extractTextFromImage(file);
      }

      if (text.trim()) {
        setInputText((prev) => prev ? prev + "\n\n" + text : text);
        toast.success(`${type.toUpperCase()} content extracted!`);
      } else {
        toast.error("Could not extract text. Try a clearer file.");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to process ${type}`);
    } finally {
      setIsExtracting(false);
      // Reset input
      if (event.target) event.target.value = "";
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setInputText(prev => prev + " " + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      toast.error("Error occurred in recognition: " + event.error);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text or upload a file first.");
      return;
    }

    setIsProcessing(true);
    try {
      const output = await generateStudyContent(selectedFeature, inputText, difficulty);
      setResult(output);
      toast.success("Generated successfully!");
    } catch (error: any) {
      console.error("Content Generation Error:", error);
      toast.error(`Error: ${error.message || "Failed to generate content"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in relative">
        <div className="absolute top-0 right-0">
          <Link to="/ai-library">
            <Button variant="ghost" size="sm" className="gap-2">
              <BookOpen className="w-4 h-4" />
              My Library
            </Button>
          </Link>
        </div>

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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-fade-in stagger-1">
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
          <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-2">
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
                  <ImageIcon className="w-4 h-4" />
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
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e, 'pdf')}
                  />
                  {isExtracting ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-10 h-10 mx-auto mb-4 text-primary animate-spin" />
                      <p className="font-medium text-foreground mb-1">Extracting text...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="font-medium text-foreground mb-1">Drop your PDF here</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="image" className="mt-0">
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <input
                    type="file"
                    ref={imageInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                  />
                  {isExtracting ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-10 h-10 mx-auto mb-4 text-primary animate-spin" />
                      <p className="font-medium text-foreground mb-1">Extracting text...</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="font-medium text-foreground mb-1">Upload study image</p>
                      <p className="text-sm text-muted-foreground">We'll extract text using OCR</p>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="voice" className="mt-0">
                <div className="border-2 border-dashed border-border rounded-xl p-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                    <Button
                      size="icon"
                      variant={isRecording ? "destructive" : "default"}
                      className={cn("w-14 h-14 rounded-full transition-all", isRecording && "animate-pulse")}
                      onClick={toggleRecording}
                    >
                      {isRecording ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </Button>
                  </div>
                  <p className="font-medium text-foreground mb-1">
                    {isRecording ? "Listening..." : "Click to start recording"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isRecording ? "Speak now" : "Speak your notes or topic"}
                  </p>
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
                disabled={!inputText.trim() || isProcessing || isExtracting}
                className="btn-gradient rounded-xl px-6 min-w-[120px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>

            {/* Text Preview (optional, good for verifying extraction) */}
            {inputText.length > 0 && (
              <div className="mt-4 p-3 bg-secondary/30 rounded-lg text-xs text-muted-foreground max-h-20 overflow-y-auto truncate">
                Preview: {inputText.substring(0, 150)}...
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className={cn("animate-fade-in stagger-3", !result && "hidden lg:block")}>
          {result ? (
            <AIResultViewer
              result={result}
              onClose={() => setResult(null)}
              featureId={selectedFeature}
            />
          ) : (
            <div className="glass-card rounded-2xl p-6 sticky top-8 text-center py-20 min-h-[400px] flex flex-col items-center justify-center border-dashed border-2 border-border/50 bg-secondary/10">
              <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6 animate-pulse">
                <Sparkles className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Create</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Select a tool, enter your topic, and watch the AI magic happen right here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
