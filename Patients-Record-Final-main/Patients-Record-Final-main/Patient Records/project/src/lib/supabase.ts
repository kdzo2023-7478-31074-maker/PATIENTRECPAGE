import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PatientRecord {
  patient_id: number;
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
  age: number | null;
  gender: string | null;
  address: string | null;
  phone_number: string | null;
  emergency_contact_name: string | null;
  emergency_contact_number: string | null;
  diagnosis: string | null;
  treatment: string | null;
  date_of_record: string | null;
  appointment_id: number | null;
  prescription_id: number | null;
}