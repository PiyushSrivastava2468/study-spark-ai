import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppDataProvider } from "@/contexts/AppDataContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Focus from "@/pages/Focus";
import Planner from "@/pages/Planner";
import GPA from "@/pages/GPA";
import SavedMaterials from "@/pages/SavedMaterials";
import AIHub from "@/pages/AIHub";
import Goals from "@/pages/Goals";


import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import Notes from "@/pages/Notes";
import History from "@/pages/History";
import AIChat from "@/pages/AIChat";
import Tutorials from "@/pages/Tutorials";
import Features from "@/pages/Features";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <AppDataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/tasks" element={<Tasks />} />
                          <Route path="/notes" element={<Notes />} />
                          <Route path="/focus" element={<Focus />} />
                          <Route path="/planner" element={<Planner />} />
                          <Route path="/gpa" element={<GPA />} />
                          <Route path="/ai-hub" element={<AIHub />} />
                          <Route path="/ai-library" element={<SavedMaterials />} />
                          <Route path="/goals" element={<Goals />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/history" element={<History />} />
                          <Route path="/ai-chat" element={<AIChat />} />
                          <Route path="/tutorials" element={<Tutorials />} />
                          <Route path="/features" element={<Features />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppDataProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
