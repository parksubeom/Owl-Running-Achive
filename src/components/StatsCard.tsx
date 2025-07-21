import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "success" | "info" | "warning";
}

export const StatsCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend,
  color = "primary" 
}: StatsCardProps) => {
  const colorClasses = {
    primary: "from-primary/10 to-primary/5 text-primary",
    success: "from-accent/10 to-accent/5 text-accent", 
    info: "from-info/10 to-info/5 text-info",
    warning: "from-warning/10 to-warning/5 text-warning"
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] border-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {trend && (
            <p className="text-xs text-accent font-medium mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};