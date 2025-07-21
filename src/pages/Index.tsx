import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { ChallengeCard } from "@/components/ChallengeCard";
import { AchievementCard } from "@/components/AchievementCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  PlayCircle,
  Timer,
  Trophy
} from "lucide-react";
import heroImage from "@/assets/hero-runner.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="h-[300px] bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white space-y-6 max-w-lg">
              <div className="space-y-2">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  이번 주 목표
                </Badge>
                <h1 className="text-4xl font-bold leading-tight">
                  오늘도 한 걸음 더 나아가세요
                </h1>
                <p className="text-xl text-white/90">
                  25km 중 15km 완주 • 60% 달성
                </p>
              </div>
              <Button size="lg" className="bg-white text-foreground hover:bg-white/90">
                <PlayCircle className="mr-2 h-5 w-5" />
                러닝 시작하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Overview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">이번 주 현황</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="총 거리"
              value="15.2"
              unit="km"
              icon={Activity}
              trend="+2.1km 증가"
              color="primary"
            />
            <StatsCard
              title="러닝 시간"
              value="1:45"
              unit="시간"
              icon={Clock}
              trend="+15분 증가"
              color="success"
            />
            <StatsCard
              title="칼로리 소모"
              value="1,240"
              unit="kcal"
              icon={Target}
              trend="+180kcal"
              color="info"
            />
            <StatsCard
              title="평균 페이스"
              value="6:45"
              unit="min/km"
              icon={TrendingUp}
              trend="15초 단축"
              color="warning"
            />
          </div>
        </section>

        {/* Active Challenges */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">진행 중인 챌린지</h2>
            <Button variant="ghost" className="text-primary">
              모든 챌린지 보기
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChallengeCard
              title="30일 꾸준히 달리기"
              description="매일 최소 3km 이상 달리는 챌린지"
              progress={60}
              target="30일"
              timeLeft="12일 남음"
              participants={1247}
              difficulty="보통"
              reward="금메달 + 500 포인트"
              isJoined={true}
            />
            <ChallengeCard
              title="이번 주 25km 완주"
              description="일주일 동안 총 25km 달리기"
              progress={75}
              target="25km"
              timeLeft="3일 남음"
              participants={892}
              difficulty="쉬움"
              reward="은메달 + 300 포인트"
              isJoined={true}
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">빠른 실행</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gradient-primary text-white hover:shadow-primary hover:scale-[1.02] transition-all duration-300 cursor-pointer border-0">
              <div className="flex items-center gap-4">
                <PlayCircle className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold">러닝 시작</h3>
                  <p className="text-sm text-white/80">새로운 러닝 기록하기</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-secondary text-white hover:shadow-elevated hover:scale-[1.02] transition-all duration-300 cursor-pointer border-0">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold">운동 계획</h3>
                  <p className="text-sm text-white/80">이번 주 계획 세우기</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated hover:scale-[1.02] transition-all duration-300 cursor-pointer border-0">
              <div className="flex items-center gap-4">
                <Trophy className="h-8 w-8 text-accent" />
                <div>
                  <h3 className="font-semibold text-foreground">성과 분석</h3>
                  <p className="text-sm text-muted-foreground">내 기록과 통계 보기</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Recent Achievements */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">최근 성취</h2>
            <Button variant="ghost" className="text-primary">
              모든 성취 보기
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AchievementCard
              title="첫 10km 완주"
              description="처음으로 10km를 완주했습니다"
              type="gold"
              isUnlocked={true}
              date="2024-01-15"
            />
            <AchievementCard
              title="일주일 연속 러닝"
              description="7일 연속으로 러닝을 완료했습니다"
              type="silver"
              isUnlocked={true}
              date="2024-01-20"
            />
            <AchievementCard
              title="월간 100km 달리기"
              description="한 달 동안 총 100km 달리기"
              type="special"
              isUnlocked={false}
              progress={67}
              target={100}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
