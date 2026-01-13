import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const {
	VITE_KAKAO_REST_API_KEY,
	VITE_KAKAO_REDIRECT_URI,
	VITE_GOOGLE_CLIENT_ID,
	VITE_GOOGLE_REDIRECT_URI,
	VITE_NAVER_CLIENT_ID,
	VITE_NAVER_REDIRECT_URI,
} = import.meta.env;

export default function Home() {
	const navigate = useNavigate();
	const toLogin = () => {
		navigate("/auth/login");
	};
	const toSignUp = () => {
		navigate("/auth/signup");
	};
	// 카카오 로그인
	const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${VITE_KAKAO_REST_API_KEY}&redirect_uri=${VITE_KAKAO_REDIRECT_URI}&response_type=code`;
	const handleKakaoLogin = () => {
		console.log(kakaoURL);
		window.location.href = kakaoURL;
	};

	// 구글 로그인
	const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?
		scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&
		include_granted_scopes=true&
		response_type=token&
		state=state_parameter_passthrough_value&
		redirect_uri=${VITE_GOOGLE_REDIRECT_URI}&
		client_id=${VITE_GOOGLE_CLIENT_ID}`;
	const handleGoogleLogin = () => {
		window.location.href = googleURL;
	};

	// 네이버 로그인
	function generateState() {
		return crypto.randomUUID();
	}
	const state = generateState();
	sessionStorage.setItem("naver_oauth_state", state);
	const naverURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${VITE_NAVER_CLIENT_ID}&state=${state}&redirect_uri=${VITE_NAVER_REDIRECT_URI}`;
	const handleNaverLogin = () => {
		window.location.href = naverURL;
	};

	return (
		<div>
			<div>
				<img src={logo} alt="Logo" />
				<h1>행샤</h1>
				<div>
					<button type="button" onClick={toLogin}>
						로그인
					</button>
					<button type="button" onClick={handleGoogleLogin}>
						<span>구글 계정으로 계속하기</span>
					</button>
					<button type="button" onClick={handleKakaoLogin}>
						<span>카카오톡 계정으로 계속하기</span>
					</button>
					<button type="button" onClick={handleNaverLogin}>
						<span>네이버 계정으로 계속하기</span>
					</button>
					<button type="button" onClick={toSignUp}>
						회원가입
					</button>
				</div>
			</div>
		</div>
	);
}
