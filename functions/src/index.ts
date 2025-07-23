import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

//admin.initializeApp();
const KAKAO_CLIENT_ID = "63da9f3220a466c8b8d5aca36e64f6b4"
const KAKAO_REDIRECT_URI = "http://localhost:8080/login/callback"
const KAKAO_CLIENT_SECRET = "k6DwWKqYJC86LBHLcjk6VJaB9AxBuSMd"


export const kakaoAuth = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    const { code } = req.body;
    try {
        // 1. code로 access token 요청
        const tokenRes = await axios.post(
            "https://kauth.kakao.com/oauth/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                client_id: KAKAO_CLIENT_ID,
                redirect_uri: KAKAO_REDIRECT_URI,
                code,
                ...(KAKAO_CLIENT_SECRET ? { client_secret: KAKAO_CLIENT_SECRET } : {}),
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        const { access_token } = tokenRes.data;

        // 2. access token으로 사용자 정보 요청
        const userRes = await axios.get("https://kapi.kakao.com/v2/user/me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const kakaoUser = userRes.data;
        const kakaoUid = `kakao:${kakaoUser.id}`;

        // 3. Firebase 커스텀 토큰 발급
        const customToken = await admin.auth().createCustomToken(kakaoUid, {
            kakaoProfile: kakaoUser,
        });

        // 4. 커스텀 토큰 반환
        res.json({ customToken });
    } catch (err: unknown) { // 1. 타입을 'unknown'으로 변경
        // 2. err가 response 속성을 가진 객체인지 간단히 확인
        if (typeof err === 'object' && err !== null && 'response' in err) {
            // Axios 에러와 유사한 객체로 간주하고 데이터에 접근
            console.error((err as { response?: { data?: unknown } }).response?.data || err);
        } else {
            // 일반적인 Error 객체나 문자열인 경우
            console.error(err);
        }
        res.status(500).json({ error: "카카오 인증 실패" });
    }
});
