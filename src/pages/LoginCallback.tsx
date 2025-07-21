import { useEffect, useState } from "react";

const LoginCallback = () => {
    const [code, setCode] = useState<string | null>(null);

    useEffect(() => {
        const url = new URL(window.location.href);
        setCode(url.searchParams.get("code"));
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-background">
            <div className="bg-card rounded-xl shadow-card p-8 max-w-md w-full text-center">
                <h2 className="text-xl font-bold mb-4">카카오 로그인 콜백</h2>
                {code ? (
                    <>
                        <div className="mb-2 text-foreground">code: <span className="font-mono break-all">{code}</span></div>
                        <div className="text-sm text-muted-foreground">이 코드를 백엔드/클라우드 펑션으로 전달해 Firebase Auth 연동을 진행해야 합니다.</div>
                    </>
                ) : (
                    <div className="text-red-600">code 파라미터가 없습니다.</div>
                )}
            </div>
        </div>
    );
};

export default LoginCallback; 