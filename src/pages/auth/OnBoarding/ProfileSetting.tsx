import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {updateUser} from "../../../api/auth";
import defaultProfile from "../../../assets/defaultProfile.png";

export default function ProfileSetting() {
	const name = useRef<HTMLInputElement>(null);
	const [, setSearchParams] = useSearchParams();
	const DEFAULT_PROFILE_URL = defaultProfile;
	const [previewUrl, setPreviewUrl] = useState(DEFAULT_PROFILE_URL);
	const [, setIsDefaultProfile] = useState(true);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setPreviewUrl(URL.createObjectURL(file));
		setIsDefaultProfile(false);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		updateUser(name.current?.value, previewUrl);

		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.set("step", "onboarding");
			return next;
		});
	};
	return (
		<div>
			<h1>프로필 설정</h1>
			<p>프로필 사진과 이름을 설정해주세요.</p>
			<form onSubmit={handleSubmit}>
				<img src={previewUrl} alt="프로필 사진 미리보기" />
				<input
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					alt="프로필 사진 업로드"
				/>
				<input type="text" placeholder="푱푱한 토끼" ref={name} />
				<button type="submit">닉네임 설정하기</button>
			</form>
		</div>
	);
}
