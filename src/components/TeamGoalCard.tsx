import React from "react";

export type Member = { name: string; distance: number };
export type TeamGoalCardProps = {
    goal: number;
    current: number;
    week: string;
    members: Member[];
};

export const TeamGoalCard = ({ goal, current, week, members }: TeamGoalCardProps) => (
    <div className="p-6 bg-gradient-card rounded-xl shadow-card border-0 mb-6">
        <h2 className="text-xl font-bold mb-2 text-foreground">이번 주 목표: {goal}km</h2>
        <div className="mb-2 text-lg font-semibold text-primary">
            진행률: {current}km / {goal}km ({Math.round((current / goal) * 100)}%)
        </div>
        <div className="w-full h-3 bg-muted rounded-full mb-4 overflow-hidden">
            <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min((current / goal) * 100, 100)}%` }}
            />
        </div>
        <div className="text-sm text-muted-foreground mb-2">주차: {week}</div>
        <ul className="mb-2">
            {members.map((m) => (
                <li key={m.name} className="text-sm text-foreground">
                    {m.name}: <span className="font-medium">{m.distance}km</span>
                </li>
            ))}
        </ul>
        {current >= goal && (
            <div className="mt-4 text-green-600 font-bold text-center">🎉 목표 달성!</div>
        )}
    </div>
); 