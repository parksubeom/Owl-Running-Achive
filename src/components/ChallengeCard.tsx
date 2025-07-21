import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Users } from "lucide-react";

interface ChallengeCardProps {
  title: string;
  description: string;
  progress: number;
  target: string;
  timeLeft: string;
  participants: number;
  difficulty: "쉬움" | "보통" | "어려움";
  reward: string;
  isJoined?: boolean;
}

export const ChallengeCard = ({
  title,
  description,
  progress,
  target,
  timeLeft,
  participants,
  difficulty,
  reward,
  isJoined = false
}: ChallengeCardProps) => {
  const difficultyColors = {
    "쉬움": "bg-accent/10 text-accent",
    "보통": "bg-warning/10 text-warning", 
    "어려움": "bg-destructive/10 text-destructive"
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] border-0">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge className={difficultyColors[difficulty]}>
            {difficulty}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">진행률</span>
            <span className="font-medium text-foreground">{progress}% / {target}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{timeLeft}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{participants}명 참여</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-lg border border-accent/10">
          <Trophy className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-foreground">보상: {reward}</span>
        </div>

        <Button 
          variant={isJoined ? "success" : "default"}
          className="w-full"
          size="lg"
        >
          {isJoined ? "참여 중" : "챌린지 참여"}
        </Button>
      </div>
    </Card>
  );
};