import { useEffect, useState } from "react";
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// 로그인 상태를 명확하게 관리하기 위한 타입 정의
type LoginStatus = 'idle' | 'loading' | 'success' | 'error';

const LoginCallback = () => {
    const [code, setCode] = useState<string | null>(null);
    const [status, setStatus] = useState<LoginStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogin = async () => {
            // 1. URL에서 인증 코드 가져오기
            const codeFromUrl = new URL(window.location.href).searchParams.get("code");

            if (!codeFromUrl) {
                setStatus('error');
                setError('URL에서 카카오 인증 코드를 찾을 수 없습니다.');
                return;
            }

            // UI 표시를 위해 state에 코드 저장
            setCode(codeFromUrl);
            setStatus('loading'); // 로그인 상태를 '로딩 중'으로 변경

            try {
                // 2. Firebase Functions에 토큰 요청
                const response = await fetch('http://127.0.0.1:5001/owl-running-achieve/us-central1/kakaoAuth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: codeFromUrl }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `서버 통신 오류: ${response.status}`);
                }

                const data = await response.json();

                // 3. 커스텀 토큰으로 Firebase 로그인
                if (data.customToken) {
                    const auth = getAuth();
                    await signInWithCustomToken(auth, data.customToken);
                    setStatus('success');
                    localStorage.setItem('isAuthenticated', 'true');
                    // 1.5초 후 메인 페이지로 이동하여 성공 메시지를 잠시 보여줌
                    setTimeout(() => navigate('/'), 1500);

                } else {
                    throw new Error("서버로부터 커스텀 토큰을 받지 못했습니다.");
                }
            } catch (err: any) {
                console.error("로그인 처리 중 에러 발생:", err);
                setStatus('error');
                setError(err.message || "알 수 없는 오류가 발생했습니다.");
            }
        };

        handleLogin();

        // 이 useEffect는 컴포넌트가 처음 렌더링될 때 한 번만 실행됩니다.
    }, [navigate]);

    // 로그인 상태에 따라 다른 UI를 보여주는 함수
    const renderStatusMessage = () => {
        switch (status) {
            case 'loading':
                return <div className="text-sm text-muted-foreground">로그인 정보를 확인 중입니다...</div>;
            case 'success':
                return <div className="text-green-600 font-bold">로그인 성공! 잠시 후 이동합니다.</div>;
            case 'error':
                return (
                    <div className="text-red-600">
                        <p className="font-bold">오류 발생</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                );
            default: // 'idle' 상태
                return <div className="text-sm text-muted-foreground">잠시만 기다려주세요...</div>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-background">
            <div className="bg-card rounded-xl shadow-card p-8 max-w-md w-full text-center">
                <h2 className="text-xl font-bold mb-4">카카오 로그인 처리 중</h2>
                {code && (
                    <div className="mb-4 text-foreground">
                        인증 코드: <span className="font-mono break-all text-xs">{code}</span>
                    </div>
                )}
                <div className="mt-4">
                    {renderStatusMessage()}
                </div>
            </div>
        </div>
    );
};

export default LoginCallback;