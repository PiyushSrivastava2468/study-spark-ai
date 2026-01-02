import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppDataProvider } from "@/contexts/AppDataContext";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Focus from "@/pages/Focus";
import Planner from "@/pages/Planner";
import GPA from "@/pages/GPA";
import AIHub from "@/pages/AIHub";
import Goals from "@/pages/Goals";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import Notes from "@/pages/Notes";
import History from "@/pages/History";
import Install from "@/pages/Install";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AppDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/focus" element={<Focus />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/gpa" element={<GPA />} />
                <Route path="/ai-hub" element={<AIHub />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/history" element={<History />} />
                <Route path="/install" element={<Install />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AppDataProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
