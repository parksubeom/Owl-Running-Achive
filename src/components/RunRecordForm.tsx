import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

interface RunRecordFormProps {
    userId: string;
    teamId: string;
    week: string;
}

function getTodayStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export const RunRecordForm = ({ userId, teamId, week }: RunRecordFormProps) => {
    const [distance, setDistance] = useState(0);
    const [time, setTime] = useState(0); // 분 단위
    const [pace, setPace] = useState(0); // min/km
    const [calories, setCalories] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [submittedDate, setSubmittedDate] = useState<string | null>(null);

    // 오늘 날짜에 이미 기록이 있는지 확인
    useEffect(() => {
        const checkToday = async () => {
            const today = getTodayStr();
            const q = query(
                collection(db, "runRecords"),
                where("userId", "==", userId),
                where("teamId", "==", teamId),
                where("week", "==", week)
            );
            const snapshot = await getDocs(q);
            const found = snapshot.docs.find(doc => (doc.data().date || "").slice(0, 10) === today);
            if (found) {
                setAlreadySubmitted(true);
                setSubmittedDate(today);
            } else {
                setAlreadySubmitted(false);
                setSubmittedDate(null);
            }
        };
        checkToday();
    }, [userId, teamId, week, success]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            await addDoc(collection(db, "runRecords"), {
                userId,
                teamId,
                week,
                distanceKm: Number(distance),
                timeMin: Number(time),
                paceMinPerKm: Number(pace),
                calories: Number(calories),
                date: new Date().toISOString(),
                createdAt: serverTimestamp(),
            });
            setSuccess(true);
            setDistance(0);
            setTime(0);
            setPace(0);
            setCalories(0);
            setAlreadySubmitted(true);
            setSubmittedDate(getTodayStr());
        } catch (err) {
            alert("저장 실패: " + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if ((alreadySubmitted && submittedDate) || success) {
        const [y, m, d] = (submittedDate || getTodayStr()).split("-");
        return (
            <Card className="max-w-2xl mx-auto mb-8 p-6 bg-gradient-card shadow-card border-0 text-center">
                <div className="text-green-600 font-semibold text-lg">{`${y}.${m}.${d} 입력 완료되었습니다.`}</div>
            </Card>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto mb-8 p-6 bg-gradient-card shadow-card border-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4 items-center">
                    <label className="font-medium text-right pr-2">오늘 달린 거리 (km)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={distance}
                        onChange={e => setDistance(Number(e.target.value))}
                        className="border-b border-input bg-transparent px-2 py-1 focus:outline-none focus:border-primary transition w-full"
                        required
                        disabled={loading}
                    />
                    <label className="font-medium text-right pr-2">러닝 시간 (분)</label>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={time}
                        onChange={e => setTime(Number(e.target.value))}
                        className="border-b border-input bg-transparent px-2 py-1 focus:outline-none focus:border-primary transition w-full"
                        required
                        disabled={loading}
                    />
                    <label className="font-medium text-right pr-2">평균 페이스 (min/km)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={pace}
                        onChange={e => setPace(Number(e.target.value))}
                        className="border-b border-input bg-transparent px-2 py-1 focus:outline-none focus:border-primary transition w-full"
                        required
                        disabled={loading}
                    />
                    <label className="font-medium text-right pr-2">칼로리 (kcal)</label>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={calories}
                        onChange={e => setCalories(Number(e.target.value))}
                        className="border-b border-input bg-transparent px-2 py-1 focus:outline-none focus:border-primary transition w-full"
                        required
                        disabled={loading}
                    />
                </div>
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                    {loading ? "저장 중..." : "기록 저장"}
                </Button>
            </form>
        </Card>
    );
}; 