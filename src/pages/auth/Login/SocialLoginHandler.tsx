// SocialLoginHandler.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

type Provider = "GOOGLE" | "KAKAO" | "NAVER";

const LoginHandler = ({ provider }: { provider: Provider }) => {
	const navigate = useNavigate();
	const { socialLogin } = useAuth();

	useEffect(() => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get("code");
		const state = url.searchParams.get("state");

		if (!code) {
			navigate("/auth/login", { replace: true });
			return;
		}

		const run = async () => {
			try {
				let verifier: string | undefined;

				if (provider === "GOOGLE") {
					const savedState = sessionStorage.getItem("google_oauth_state");
					const codeVerifier = sessionStorage.getItem("google_code_verifier");

					if (!state || state !== savedState || !codeVerifier) {
						throw new Error("Invalid google oauth state/verifier");
					}
					verifier = codeVerifier;
				}

				if (provider === "NAVER") {
					const savedState = sessionStorage.getItem("naver_oauth_state");
					if (!state || state !== savedState) {
						throw new Error("Invalid naver oauth state");
					}
				}

				if (provider === "KAKAO") {
					const savedState = sessionStorage.getItem("kakao_oauth_state");
					// 카카오는 state를 안 보낼 수도 있어서(설정/앱에 따라) 여기서 강제할지 선택 가능
					// 지금은 Home에서 state를 넣었으니 검증 강제하는 게 안전.
					if (!state || state !== savedState) {
						throw new Error("Invalid kakao oauth state");
					}
				}

				await socialLogin(provider, code, verifier);

				// ✅ 한 번 쓰고 정리(꼬임 방지)
				sessionStorage.removeItem("google_oauth_state");
				sessionStorage.removeItem("google_code_verifier");
				sessionStorage.removeItem("naver_oauth_state");
				sessionStorage.removeItem("kakao_oauth_state");

				navigate("/auth/complete", { replace: true });
			} catch (e) {
				console.error(e);

				// 실패 시에도 정리
				sessionStorage.removeItem("google_oauth_state");
				sessionStorage.removeItem("google_code_verifier");
				sessionStorage.removeItem("naver_oauth_state");
				sessionStorage.removeItem("kakao_oauth_state");

				navigate("/auth/login", { replace: true });
			}
		};

		run();
	}, [provider, navigate, socialLogin]);

	return <div>로그인 처리 중...</div>;
};

export default LoginHandler;
