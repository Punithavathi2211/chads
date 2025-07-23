import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://epcqgxurugjjsuwdsevm.supabase.co'; // Replace with your Supabase URL
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwY3FneHVydWdqanN1d2RzZXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODE5NjQsImV4cCI6MjA2ODc1Nzk2NH0.r1mdm_Fn1BOY2elwpQ1LakDNf2dPTu6vog9G7qQ0WHU'; // Replace with your Supabase Public Key

export const supabase = createClient(supabaseUrl, supabaseKey);
