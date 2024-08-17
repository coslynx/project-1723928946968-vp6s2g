import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getServerSession = async () => {
  const { data: session } = await supabase.auth.getSession();
  return session;
};

export const signInWithPassword = async (email, password) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return error;
};

export const signUpWithPassword = async (email, password) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  return error;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return error;
};