import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png";

export default function Home() {
    const navigate = useNavigate();
    const toLogin = () => {
        navigate("/auth/login");
    }
    const toSignUp = () => {
        navigate("/auth/signup");
    }
    return (
        <div>
            <div>
                <img src={logo} alt="Logo" />
                <h1>행샤</h1>
                <div>
                    <button type="button" onClick={toLogin}>로그인</button>
                    <button type="button" onClick={toSignUp}>행샤 회원가입</button>
                </div>
            </div>
        </div>
    )
}