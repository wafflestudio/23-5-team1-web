// Home.tsx
import { useNavigate } from "react-router-dom";
import logo from "/assets/logo.png";
import styles from "./Home.module.css";

const {
	VITE_KAKAO_REST_API_KEY,
	VITE_KAKAO_REDIRECT_URI,
	VITE_GOOGLE_CLIENT_ID,
	VITE_GOOGLE_REDIRECT_URI,
	VITE_NAVER_CLIENT_ID,
	VITE_NAVER_REDIRECT_URI,
} = import.meta.env;

/** base64url(+) */
function base64UrlEncode(bytes: ArrayBuffer) {
	const uint8 = new Uint8Array(bytes);
	let bin = "";
	for (const b of uint8) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** sha256 */
async function sha256(text: string) {
	const data = new TextEncoder().encode(text);
	return crypto.subtle.digest("SHA-256", data);
}

/** PKCE code_verifier (43~128 chars 권장) */
function makeCodeVerifier(len = 64) {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
	const bytes = crypto.getRandomValues(new Uint8Array(len));
	return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export default function Home() {
	const navigate = useNavigate();

	const toLogin = () => navigate("/auth/login");
	const toSignUp = () => navigate("/auth/signup");

	// ✅ Kakao: state 생성/저장 + URLSearchParams
	const handleKakaoLogin = () => {
		const state = crypto.randomUUID();
		sessionStorage.setItem("kakao_oauth_state", state);

		const url = new URL("https://kauth.kakao.com/oauth/authorize");
		url.search = new URLSearchParams({
			client_id: VITE_KAKAO_REST_API_KEY,
			redirect_uri: VITE_KAKAO_REDIRECT_URI,
			response_type: "code",
			state,
		}).toString();

		window.location.href = url.toString();
	};

	// ✅ Google: PKCE + state 생성/저장 + URLSearchParams
	const handleGoogleLogin = async () => {
		const state = crypto.randomUUID();
		const codeVerifier = makeCodeVerifier(64);
		const digest = await sha256(codeVerifier);
		const codeChallenge = base64UrlEncode(digest);

		sessionStorage.setItem("google_oauth_state", state);
		sessionStorage.setItem("google_code_verifier", codeVerifier);

		const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
		url.search = new URLSearchParams({
			client_id: VITE_GOOGLE_CLIENT_ID,
			redirect_uri: VITE_GOOGLE_REDIRECT_URI,
			response_type: "code",
			scope: "openid email profile",
			include_granted_scopes: "true",
			state,
			code_challenge: codeChallenge,
			code_challenge_method: "S256",
			// 필요하면 추가:
			// access_type: "offline",
			// prompt: "consent",
		}).toString();

		window.location.href = url.toString();
	};

	// ✅ Naver: 클릭 시점에서 state 생성/저장
	const handleNaverLogin = () => {
		const state = crypto.randomUUID();
		sessionStorage.setItem("naver_oauth_state", state);

		const url = new URL("https://nid.naver.com/oauth2.0/authorize");
		url.search = new URLSearchParams({
			response_type: "code",
			client_id: VITE_NAVER_CLIENT_ID,
			redirect_uri: VITE_NAVER_REDIRECT_URI,
			state,
		}).toString();

		window.location.href = url.toString();
	};

	return (
		<div className={styles.page}>
			<div className={styles.box}>
				<div className={styles.brand}>
					<img className={styles.logo} src={logo} alt="Logo" />
					<h1 className={styles.title}>행샤</h1>
				</div>

				<div className={styles.actions}>
					<button className={styles.btn} type="button" onClick={toLogin}>
						로그인
					</button>

					<button
						className={`${styles.btn} ${styles.social}`}
						data-provider="google"
						type="button"
						onClick={handleGoogleLogin}
					>
						<span>구글 계정으로 계속하기</span>
					</button>

					<button
						className={`${styles.btn} ${styles.social}`}
						data-provider="kakao"
						type="button"
						onClick={handleKakaoLogin}
					>
						<span>카카오톡 계정으로 계속하기</span>
					</button>

					<button
						className={`${styles.btn} ${styles.social}`}
						data-provider="naver"
						type="button"
						onClick={handleNaverLogin}
					>
						<span>네이버 계정으로 계속하기</span>
					</button>

					<button
						className={`${styles.btn} ${styles.primary}`}
						type="button"
						onClick={toSignUp}
					>
						회원가입
					</button>
				</div>
			</div>
		</div>
	);
}
