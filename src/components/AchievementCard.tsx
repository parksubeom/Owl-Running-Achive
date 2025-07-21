import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Star, Target } from "lucide-react";

interface AchievementCardProps {
  title: string;
  description: string;
  type: "bronze" | "silver" | "gold" | "special";
  isUnlocked: boolean;
  progress?: number;
  target?: number;
  date?: string;
}

export const AchievementCard = ({
  title,
  description,
  type,
  isUnlocked,
  progress = 0,
  target = 100,
  date
}: AchievementCardProps) => {
  const typeConfig = {
    bronze: { 
      icon: Medal, 
      color: "from-amber-600/20 to-amber-400/10", 
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    silver: { 
      icon: Medal, 
      color: "from-slate-400/20 to-slate-300/10", 
      iconColor: "text-slate-600",
      bgColor: "bg-slate-50"
    },
    gold: { 
      icon: Trophy, 
      color: "from-yellow-500/20 to-yellow-400/10", 
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    special: { 
      icon: Star, 
      color: "from-purple-500/20 to-purple-400/10", 
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;
  const progressPercent = target ? (progress / target) * 100 : 0;

  return (
    <Card className={`p-4 transition-all duration-300 border-0 ${
      isUnlocked 
        ? "bg-gradient-card shadow-card hover:shadow-elevated hover:scale-[1.02]" 
        : "bg-muted/30 opacity-60"
    }`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color} ${
          isUnlocked ? "" : "grayscale"
        }`}>
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            
            {isUnlocked && (
              <Badge className="bg-accent/10 text-accent border-accent/20">
                달성
              </Badge>
            )}
          </div>

          {!isUnlocked && target && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>진행률</span>
                <span>{progress} / {target}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-gradient-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
            </div>
          )}

          {isUnlocked && date && (
            <p className="text-xs text-muted-foreground">달성일: {date}</p>
          )}
        </div>
      </div>
    </Card>
  );
};