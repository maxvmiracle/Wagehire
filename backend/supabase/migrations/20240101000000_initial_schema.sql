-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (candidates) with updated role system
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'candidate',
  phone TEXT,
  resume_url TEXT,
  current_position TEXT,
  experience_years INTEGER,
  skills TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token TEXT,
  email_verification_expires TIMESTAMP WITH TIME ZONE,
  password_reset_token TEXT,
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interviews table for candidate's interview schedules
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled',
  round INTEGER DEFAULT 1,
  interview_type TEXT DEFAULT 'technical',
  location TEXT,
  notes TEXT,
  company_website TEXT,
  company_linkedin_url TEXT,
  other_urls TEXT,
  job_description TEXT,
  salary_range TEXT,
  interviewer_name TEXT,
  interviewer_email TEXT,
  interviewer_position TEXT,
  interviewer_linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (candidate_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  resume_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create interview_feedback table for candidate's interview feedback
CREATE TABLE IF NOT EXISTS interview_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID NOT NULL,
  candidate_id UUID NOT NULL,
  technical_skills INTEGER,
  communication_skills INTEGER,
  problem_solving INTEGER,
  cultural_fit INTEGER,
  overall_rating INTEGER,
  feedback_text TEXT,
  recommendation TEXT,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (interview_id) REFERENCES interviews (id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_id ON interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_date ON interviews(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_feedback_interview_id ON interview_feedback(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_feedback_candidate_id ON interview_feedback(candidate_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can insert their own data
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Interviews policies
CREATE POLICY "Users can view own interviews" ON interviews FOR SELECT USING (candidate_id::text = auth.uid()::text);
CREATE POLICY "Users can insert own interviews" ON interviews FOR INSERT WITH CHECK (candidate_id::text = auth.uid()::text);
CREATE POLICY "Users can update own interviews" ON interviews FOR UPDATE USING (candidate_id::text = auth.uid()::text);
CREATE POLICY "Users can delete own interviews" ON interviews FOR DELETE USING (candidate_id::text = auth.uid()::text);

-- Candidates policies (for admin access)
CREATE POLICY "Users can view own candidate profile" ON candidates FOR SELECT USING (user_id::text = auth.uid()::text);
CREATE POLICY "Users can update own candidate profile" ON candidates FOR UPDATE USING (user_id::text = auth.uid()::text);
CREATE POLICY "Users can insert own candidate profile" ON candidates FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- Interview feedback policies
CREATE POLICY "Users can view own interview feedback" ON interview_feedback FOR SELECT USING (candidate_id::text = auth.uid()::text);
CREATE POLICY "Users can insert own interview feedback" ON interview_feedback FOR INSERT WITH CHECK (candidate_id::text = auth.uid()::text);
CREATE POLICY "Users can update own interview feedback" ON interview_feedback FOR UPDATE USING (candidate_id::text = auth.uid()::text); 