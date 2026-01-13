import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Provider = "google" | "kakao" | "naver";

const {VITE_REST_REQUEST_URL} = import.meta.env;

// 액세스 토큰을 로컬 스토리지에 저장
const setAccessToken = (token: string, provider: Provider) => {
    localStorage.setItem(`${provider}_access_token`, token);
};

interface LoginHandlerProps {
    provider: Provider;
}

const LoginHandler = ({provider}: LoginHandlerProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");

        if (!code) {
            navigate("/auth/login", { replace: true });
            return;
        }
        const login = async () => {
            try {
                const response = await axios.post(
                    `${VITE_REST_REQUEST_URL}/auth/oauth/${provider}`,
                    {
                        code: code
                    },
                    {
                        withCredentials: true,
                    }
                );
                if (response.data?.accessToken) {
                    setAccessToken(response.data.accessToken, provider);
                    navigate("/");
                }else{
                    navigate("/auth/login", { replace: true });
                }
            } catch (error) {
                console.error("Error during login:", error);
                navigate("/auth/login", { replace: true });
            }
        };

        login();

    }, [provider, navigate]);
    return <div>로그인 처리 중...</div>;
};

export default LoginHandler;