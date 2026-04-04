-- ============================================
-- Lectures Table Migration
-- Run this in your Supabase SQL Editor
-- ============================================

-- Create the lectures table
CREATE TABLE IF NOT EXISTS public.lectures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT 'Other',
  description TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  thumbnail_url TEXT DEFAULT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Anyone can view published lectures" ON public.lectures;
DROP POLICY IF EXISTS "Service role can manage lectures" ON public.lectures;

-- Policy: Everyone (authenticated users) can read published lectures
CREATE POLICY "Anyone can view published lectures"
  ON public.lectures
  FOR SELECT
  USING (is_published = true);

-- Policy: Only admins can insert/update/delete (via service role or admin check)
-- For now, you can manage lectures via Supabase Dashboard or Admin Dashboard
CREATE POLICY "Service role can manage lectures"
  ON public.lectures
  FOR ALL
  USING (auth.role() = 'service_role');

-- Optional: Seed some example lectures
INSERT INTO public.lectures (title, subject, description, video_url, duration, notes) VALUES
  ('Introduction to Data Structures', 'Computer Science', 'Learn about arrays, linked lists, stacks, and queues - the fundamental building blocks of programming.', 'https://www.youtube.com/watch?v=example1', '45 min', 'Covers basic data structures with visual examples.'),
  ('Newton''s Laws of Motion', 'Physics', 'A comprehensive overview of Newton''s three laws of motion with real-world examples and problem-solving techniques.', 'https://www.youtube.com/watch?v=example2', '35 min', 'Important for competitive exams.'),
  ('Organic Chemistry Basics', 'Chemistry', 'Introduction to carbon compounds, nomenclature, and basic organic reactions.', 'https://www.youtube.com/watch?v=example3', '50 min', 'Focus on IUPAC naming conventions.'),
  ('Calculus: Limits and Derivatives', 'Mathematics', 'Understanding limits, continuity, and the concept of derivatives from first principles.', 'https://www.youtube.com/watch?v=example4', '60 min', 'Practice problems included at the end.'),
  ('Cell Biology Overview', 'Biology', 'Structure and function of cells, cell organelles, and cellular processes like mitosis and meiosis.', 'https://www.youtube.com/watch?v=example5', '40 min', 'Diagrams and microscope images included.');
