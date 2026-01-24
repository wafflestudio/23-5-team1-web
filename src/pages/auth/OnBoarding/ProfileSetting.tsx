import type React from "react";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import defaultProfile from "/assets/defaultProfile.png";
import { updateUser } from "@api/auth";
import styles from "./ProfileSetting.module.css";

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
		<div className={styles.page}>
			<div className={styles.box}>
				<header className={styles.header}>
					<h1 className={styles.title}>프로필 설정</h1>
					<p className={styles.subtitle}>프로필 사진과 이름을 설정해주세요</p>
				</header>

				<form className={styles.form} onSubmit={handleSubmit}>
					{/* 이미지 클릭하면 파일 선택 */}
					<label className={styles.avatarWrap} htmlFor="profile-image">
						<img
							className={styles.avatar}
							src={previewUrl}
							alt="프로필 사진 미리보기"
						/>
					</label>

					<input
						id="profile-image"
						className={styles.file}
						type="file"
						accept="image/*"
						onChange={handleImageChange}
					/>

					<input
						className={styles.input}
						type="text"
						placeholder="푱푱한 토끼"
						ref={name}
					/>

					<button className={styles.submit} type="submit">
						닉네임 설정하기
					</button>
				</form>
			</div>
		</div>
	);
}
