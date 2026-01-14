import { useSearchParams } from "react-router-dom";
import EmailSignUp from "./EmailSignUp";
import SocialSignUp from "./SocialSignUp";

type Method = "email" | "google" | "kakao" | "naver";

export default function SignUp() {
	const [searchParams] = useSearchParams();
	const method = (searchParams.get("method") as Method) ?? null;

	const onSelect = (selectedMethod: Method) => {
		searchParams.set("method", selectedMethod);
		window.location.search = searchParams.toString();
	};

	switch (method) {
		case "email":
			return <EmailSignUp />;
		case "google":
			return <SocialSignUp provider={method} />;
		case "kakao":
			return <SocialSignUp provider={method} />;
		case "naver":
			return <SocialSignUp provider={method} />;
	}

	return (
		<div>
			<div>
				<h2>계정 생성</h2>
				<p>가입 방법을 선택하세요.</p>
			</div>
			<div>
				<button type="submit" onClick={() => onSelect("email")}>
					이메일로 가입하기
				</button>
				<div>또는 SNS 계정으로 가입하기</div>
				<button type="button" onClick={() => onSelect("google")}>
					<span>구글 계정으로 가입하기</span>
				</button>
				<button type="button" onClick={() => onSelect("kakao")}>
					<span>카카오톡 계정으로 가입하기</span>
				</button>
				<button type="button" onClick={() => onSelect("naver")}>
					<span>네이버 계정으로 가입하기</span>
				</button>
			</div>
		</div>
	);
}
