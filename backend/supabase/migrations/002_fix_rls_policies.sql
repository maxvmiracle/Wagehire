-- Fix RLS policies to prevent infinite recursion
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Create corrected policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Simplified admin policy that doesn't cause recursion
CREATE POLICY "Enable read access for authenticated users" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to insert their own profile (handled by trigger)
CREATE POLICY "Enable insert for authenticated users" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Fix candidates policies
DROP POLICY IF EXISTS "Admins can update candidates" ON public.candidates;
DROP POLICY IF EXISTS "Admins can delete candidates" ON public.candidates;

CREATE POLICY "Enable read access for authenticated users" ON public.candidates
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON public.candidates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.candidates
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.candidates
    FOR DELETE USING (auth.role() = 'authenticated');

-- Fix interviews policies
DROP POLICY IF EXISTS "Admins can delete interviews" ON public.interviews;

CREATE POLICY "Enable read access for authenticated users" ON public.interviews
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON public.interviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.interviews
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.interviews
    FOR DELETE USING (auth.role() = 'authenticated');

-- Fix interview_submissions policies
CREATE POLICY "Enable read access for authenticated users" ON public.interview_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON public.interview_submissions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.interview_submissions
    FOR UPDATE USING (auth.role() = 'authenticated'); 