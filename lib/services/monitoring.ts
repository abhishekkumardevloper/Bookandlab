import { createAdminClient } from "@/lib/db/supabase";

export async function getSystemHealth() {
  const supabase = await createAdminClient();
  
  const start = Date.now();
  const { error } = await supabase.from("users").select("id").limit(1);
  const latency = Date.now() - start;

  // Mocking some system stats for demo purposes
  return {
    database: error ? "OFFLINE" : "HEALTHY",
    latency: `${latency}ms`,
    uptime: "99.98%",
    activeSessions: Math.floor(Math.random() * 50) + 10,
    cpuUsage: `${Math.floor(Math.random() * 15) + 5}%`,
    memoryUsage: `${Math.floor(Math.random() * 20) + 40}%`,
    lastBackup: "2 hours ago",
    regions: ["AWS-US-EAST-1", "SUPABASE-DB-SG"],
    notificationsSent: 1240,
    storageUsed: "1.2GB / 50GB"
  };
}
