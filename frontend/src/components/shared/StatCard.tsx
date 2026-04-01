import { cn } from "@/lib/com.buytheway.common.utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

const StatCard = ({ label, value, icon, trend, className }: StatCardProps) => (
  <div className={cn("stat-card", className)}>
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    {trend && <span className="text-xs text-muted-foreground">{trend}</span>}
  </div>
);

export default StatCard;
