import { useState } from "react";
import { login } from "../../api/auth";

export default function Login() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [check, setCheck] = useState<boolean>(true);
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (email.trim() === "") {
			alert("이메일을 입력하세요");
		} else if (password.trim() === "") {
			alert("비밀번호를 입력하세요");
		} else {
			login(email, password).catch(() => setCheck(false));
		}
	};

	return (
		<div>
			<div>
				<h2>로그인</h2>
			</div>
			<form onSubmit={handleSubmit}>
				<label htmlFor="uemail">
					<input
						type="email"
						id="uemail"
						placeholder="email.snu.ac.kr"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></input>
				</label>
				<label htmlFor="upw">
					<input
						type="password"
						id="upw"
						placeholder="비밀번호"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></input>
				</label>
				{!check && <p>이메일 또는 비밀번호가 일치하지 않습니다.</p>}
				<button type="submit">로그인 하기</button>
			</form>
		</div>
	);
}
