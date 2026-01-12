type Props = {
	provider: "google" | "kakao" | "naver";
};

export default function SocialSignUp({ provider }: Props) {
	return (
		<div>
			<h2>{provider} 계정으로 가입 중..</h2>
			{/* OAuth redirect / SDK 연동 처리 */}
		</div>
	);
}
