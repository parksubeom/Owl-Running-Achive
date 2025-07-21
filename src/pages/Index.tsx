import { useEffect, useState, useMemo } from "react";
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
import { TeamGoalCard } from "@/components/TeamGoalCard";
import { RunRecordForm } from "@/components/RunRecordForm";
import { db } from "@/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Index = () => {
  // 샘플/임시 데이터
  const teamGoal = 100;
  const teamWeek = "2025-3w";
  const userId = "user1";
  const teamId = "team1";

  // Firestore에서 불러온 기록 상태 (팀 전체)
  const [members, setMembers] = useState<{ name: string; distance: number }[]>([]);
  const [teamCurrent, setTeamCurrent] = useState(0);
  // Firestore에서 불러온 기록 상태 (해당 유저)
  const [userRecords, setUserRecords] = useState<any[]>([]);

  // 팀 전체 기록 실시간 구독
  useEffect(() => {
    const q = query(
      collection(db, "runRecords"),
      where("teamId", "==", teamId),
      where("week", "==", teamWeek)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => doc.data() as any);
      // 멤버별 합산
      const memberMap: Record<string, number> = {};
      records.forEach(r => {
        memberMap[r.userId] = (memberMap[r.userId] || 0) + Number(r.distanceKm);
      });
      const memberArr = Object.entries(memberMap).map(([name, distance]) => ({ name, distance }));
      setMembers(memberArr);
      setTeamCurrent(records.reduce((sum, r) => sum + Number(r.distanceKm), 0));
    });
    return () => unsub();
  }, [teamId, teamWeek]);

  // 해당 유저 기록 실시간 구독
  useEffect(() => {
    const q = query(
      collection(db, "runRecords"),
      where("teamId", "==", teamId),
      where("week", "==", teamWeek),
      where("userId", "==", userId)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setUserRecords(snapshot.docs.map(doc => doc.data() as any));
    });
    return () => unsub();
  }, [teamId, teamWeek, userId]);

  // 유저별 합산/평균 계산
  const userStats = useMemo(() => {
    if (userRecords.length === 0) return {
      totalDistance: 0,
      totalTime: 0,
      totalCalories: 0,
      avgPace: 0,
      trendDistance: 0,
      trendTime: 0,
      trendCalories: 0,
      trendPace: 0,
    };
    const totalDistance = userRecords.reduce((sum, r) => sum + Number(r.distanceKm), 0);
    const totalTime = userRecords.reduce((sum, r) => sum + Number(r.timeMin || 0), 0);
    const totalCalories = userRecords.reduce((sum, r) => sum + Number(r.calories || 0), 0);
    const avgPace = userRecords.length > 0 ? (
      userRecords.reduce((sum, r) => sum + Number(r.paceMinPerKm || 0), 0) / userRecords.length
    ) : 0;
    // trend 계산은 예시로 최근 2회 기록 차이(실제는 더 정교하게 가능)
    const trendDistance = userRecords.length > 1 ? (userRecords[userRecords.length - 1].distanceKm - userRecords[userRecords.length - 2].distanceKm) : 0;
    const trendTime = userRecords.length > 1 ? (userRecords[userRecords.length - 1].timeMin - userRecords[userRecords.length - 2].timeMin) : 0;
    const trendCalories = userRecords.length > 1 ? (userRecords[userRecords.length - 1].calories - userRecords[userRecords.length - 2].calories) : 0;
    const trendPace = userRecords.length > 1 ? (userRecords[userRecords.length - 1].paceMinPerKm - userRecords[userRecords.length - 2].paceMinPerKm) : 0;
    return { totalDistance, totalTime, totalCalories, avgPace, trendDistance, trendTime, trendCalories, trendPace };
  }, [userRecords]);

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
                  {teamGoal}km 중 {teamCurrent}km 완주 • {Math.round((teamCurrent / teamGoal) * 100)}%
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* 메인 컨텐츠 패딩 래퍼 */}
      <div className="px-4 md:px-8 max-w-5xl mx-auto">
        {/* 러닝 기록 입력 폼 */}
        <RunRecordForm userId={userId} teamId={teamId} week={teamWeek} />
        {/* 팀 주간 목표 카드 */}
        <div className="max-w-2xl mx-auto mt-8">
          <TeamGoalCard
            goal={teamGoal}
            current={teamCurrent}
            week={teamWeek}
            members={members}
          />
        </div>
        {/* Stats Overview */}
        <section className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold text-foreground">이번 주 현황</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="총 거리"
              value={userStats.totalDistance.toFixed(2)}
              unit="km"
              icon={Activity}
              trend={userStats.trendDistance !== 0 ? `${userStats.trendDistance > 0 ? '+' : ''}${userStats.trendDistance.toFixed(2)}km` : undefined}
              color="primary"
            />
            <StatsCard
              title="러닝 시간"
              value={userStats.totalTime.toFixed(0)}
              unit="분"
              icon={Clock}
              trend={userStats.trendTime !== 0 ? `${userStats.trendTime > 0 ? '+' : ''}${userStats.trendTime}분` : undefined}
              color="success"
            />
            <StatsCard
              title="칼로리 소모"
              value={userStats.totalCalories.toFixed(0)}
              unit="kcal"
              icon={Target}
              trend={userStats.trendCalories !== 0 ? `${userStats.trendCalories > 0 ? '+' : ''}${userStats.trendCalories}kcal` : undefined}
              color="info"
            />
            <StatsCard
              title="평균 페이스"
              value={userStats.avgPace.toFixed(2)}
              unit="min/km"
              icon={TrendingUp}
              trend={userStats.trendPace !== 0 ? `${userStats.trendPace > 0 ? '+' : ''}${userStats.trendPace.toFixed(2)} min/km` : undefined}
              color="warning"
            />
          </div>
        </section>

        {/* Active Challenges */}
        <section className="space-y-4 mt-8">
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

        {/* Recent Achievements */}
        <section className="space-y-4 mt-8">
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
