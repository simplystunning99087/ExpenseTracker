import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwyhjlzdxrflqxeqyxmo.supabase.co'; // Replace with your URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eWhqbHpkeHJmbHF4ZXF5eG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0MzQ5ODUsImV4cCI6MjEwMDAxMDk4NX0.xsgwmHxTCZ6f6ukk_EDOz5d990NQRbAXeW-DiUtMYVw'; // Replace with your key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);