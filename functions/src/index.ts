import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();
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
    } catch (err: any) {
        console.error(err.response?.data || err);
        res.status(500).json({ error: "카카오 인증 실패" });
    }
});
