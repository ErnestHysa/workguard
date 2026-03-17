-- WorkGuard Initial Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── User Profiles ────────────────────────────────────────────────────────────

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  country TEXT DEFAULT 'ireland' CHECK (country IN ('ireland', 'uk', 'other')),
  sector TEXT,
  role TEXT,
  hourly_rate DECIMAL(6,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Payslip Records ──────────────────────────────────────────────────────────

CREATE TABLE public.payslip_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  employer_name TEXT,
  pay_period_start DATE,
  pay_period_end DATE,
  gross_pay DECIMAL(10,2),
  net_pay DECIMAL(10,2),
  hours_worked DECIMAL(6,2),
  hourly_rate DECIMAL(6,2),
  status TEXT DEFAULT 'ok' CHECK (status IN ('ok', 'warning', 'violation')),
  analysis JSONB NOT NULL,
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payslip_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own payslips"
  ON public.payslip_records FOR ALL
  USING (auth.uid() = user_id);

-- ─── Contract Records ─────────────────────────────────────────────────────────

CREATE TABLE public.contract_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysed_at TIMESTAMPTZ DEFAULT NOW(),
  employer_name TEXT,
  role TEXT,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  red_flag_count INTEGER DEFAULT 0,
  analysis JSONB NOT NULL,
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contract_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own contracts"
  ON public.contract_records FOR ALL
  USING (auth.uid() = user_id);

-- ─── Shifts ───────────────────────────────────────────────────────────────────

CREATE TABLE public.shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own shifts"
  ON public.shifts FOR ALL
  USING (auth.uid() = user_id);

-- ─── Pay Period Comparisons ───────────────────────────────────────────────────

CREATE TABLE public.pay_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  logged_hours DECIMAL(6,2) NOT NULL,
  hourly_rate DECIMAL(6,2) NOT NULL,
  expected_pay DECIMAL(10,2) NOT NULL,
  actual_pay DECIMAL(10,2),
  discrepancy DECIMAL(10,2),
  discrepancy_percent DECIMAL(5,2),
  status TEXT DEFAULT 'ok' CHECK (status IN ('ok', 'underpaid', 'overpaid')),
  payslip_id UUID REFERENCES public.payslip_records(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pay_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own comparisons"
  ON public.pay_comparisons FOR ALL
  USING (auth.uid() = user_id);

-- ─── Storage Setup ────────────────────────────────────────────────────────────
-- Run these in Supabase Dashboard > Storage

-- Create bucket: payslips (private)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('payslips', 'payslips', false, 5242880, ARRAY['application/pdf', 'image/jpeg', 'image/png']);

-- Create bucket: contracts (private)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('contracts', 'contracts', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png']);

-- Storage policies (run after creating buckets)
-- CREATE POLICY "Users can upload own files" ON storage.objects
--   FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can view own files" ON storage.objects
--   FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX idx_payslip_records_user_id ON public.payslip_records(user_id);
CREATE INDEX idx_payslip_records_scanned_at ON public.payslip_records(scanned_at DESC);
CREATE INDEX idx_contract_records_user_id ON public.contract_records(user_id);
CREATE INDEX idx_shifts_user_date ON public.shifts(user_id, date DESC);
CREATE INDEX idx_pay_comparisons_user_id ON public.pay_comparisons(user_id);
