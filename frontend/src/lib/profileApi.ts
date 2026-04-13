import { supabase } from "./supabase";

export interface ProfileDTO {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: "Profiles fetched successfully",
    data,
  };
}