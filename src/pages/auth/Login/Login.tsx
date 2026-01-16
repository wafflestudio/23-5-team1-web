import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { login } from "../../../api/auth";
import "./Login.css";

export default function Login() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [check, setCheck] = useState<boolean>(true);

	const navigate = useNavigate();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (email.trim() === "") {
			alert("이메일을 입력하세요");
		} else if (password.trim() === "") {
			alert("비밀번호를 입력하세요");
		} else {
			login(email, password).catch(() => setCheck(false));
			navigate("/auth/complete");
		}
	};

	return (
		<div className="login-page">
			<div className="login-box">
				<h2 className="login-title">로그인</h2>

				<form className="login-form" onSubmit={handleSubmit}>
					<label className="login-field">
						<input
							name="email"
							className="login-input"
							type="email"
							placeholder="이메일"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</label>

					<label className="login-field">
						<input
							name="password"
							className="login-input"
							type="password"
							placeholder="비밀번호"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</label>

					{!check && (
						<p className="login-error">
							이메일 또는 비밀번호가 일치하지 않습니다.
						</p>
					)}

					<button className="login-button" type="submit">
						로그인 하기
					</button>

					<div className="login-signup">
						<span className="login-signup-text">회원가입을 하시겠어요?</span>
						<Link to="/auth/signup" className="login-signup-link">
							회원가입
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
