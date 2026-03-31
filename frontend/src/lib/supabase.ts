import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://azmnrmazqsbrzlukovrs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bW5ybWF6cXNicnpsdWtvdnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzM5OTIsImV4cCI6MjA5MDQ0OTk5Mn0.RSNfMS7asiZ0ALs2S3YJG38txl6T2CoBE6fQZ45wu9Q"
);