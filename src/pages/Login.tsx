import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-runner.jpg";

// const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code";

const KakaoLoginButton = () => {
    const handleLogin = () => {
        // 실제 카카오 인증: window.location.href = KAKAO_AUTH_URL;
        // 임시 로그인 처리
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = '/';
    };
    return (
        <button
            type="button"
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-base font-bold shadow-card border-0"
            style={{ backgroundColor: '#FEE500', color: '#191600' }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="12" cy="12" rx="12" ry="12" fill="#3C1E1E" />
                <path d="M12 4C7.03 4 3 7.26 3 11.13c0 2.13 1.29 4.01 3.3 5.23-.14.5-.51 1.8-.59 2.09 0 0-.12.39.21.54.33.15.7-.09.7-.09.92-.13 1.81-.5 2.58-.91.77.11 1.57.17 2.4.17 4.97 0 9-3.26 9-7.13C21 7.26 16.97 4 12 4z" fill="#FEE500" />
            </svg>
            카카오로 로그인
        </button>
    );
};

const Login = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center">
            {/* Hero Section */}
            <section className="w-full relative overflow-hidden mb-8">
                <div
                    className="h-[220px] bg-cover bg-center bg-no-repeat relative"
                    style={{ backgroundImage: `url(${heroImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
                    <div className="relative max-w-lg mx-auto px-4 h-full flex items-center">
                        <div className="text-white space-y-4">
                            <h1 className="text-3xl font-bold leading-tight">Owl Running Archive</h1>
                            <p className="text-lg text-white/90">카카오로 로그인 후 러닝 기록을 시작하세요</p>
                        </div>
                    </div>
                </div>
            </section>
            <Card className="w-full max-w-md p-8 shadow-card border-0 bg-gradient-card flex flex-col items-center">
                <KakaoLoginButton />
            </Card>
        </div>
    );
};

export default Login; 