import { useAuth } from "@/contexts/AuthProvider";
import Navigationbar from "@/widgets/Navigationbar";
import styles from "@styles/MyPage.module.css";
import { BookmarkWidget } from "./bookmark/Bookmark";
import { MemoWidget } from "./memo/Memo";
import { useNavigate } from "react-router-dom";
import { useTimetable } from "@/contexts/TimetableContext";
import { useEffect, useState } from "react";
import { RiPencilFill } from "react-icons/ri";
import { FaCamera } from "react-icons/fa6";
import { IoMdDoneAll } from "react-icons/io";

const ProfileCard = () => {
	const { user, updateUsername, setProfileImg } = useAuth();
	const { timetables } = useTimetable();
	const [profilePreviewUrl, setProfilePreviewUrl] = useState<string>(
		user ? user.profileImageUrl : "/assets/defaultProfile.png",
	);
	const [imgFile, setImgFile] = useState<File | null>(null);
	const [, setIsDefaultProfile] = useState<boolean>(false);
	const [username, setUsername] = useState<string>(
		user ? user.username : "유저",
	);
	const [isEditmode, setIsEditmode] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleImageError = () => {
		setProfilePreviewUrl("/assets/defaultProfile.png");
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImgFile(file);
		setProfilePreviewUrl(URL.createObjectURL(file));
		setIsDefaultProfile(false);
	};

	const handleChangesSave = () => {
		setIsEditmode(false);
		// name change
		if (username.trim() && username !== user?.username) {
			updateUsername(username);
		};
		if (imgFile) {
			// if file input is null : no changes, don't call functions
			setProfileImg(imgFile);
		};
		setImgFile(null);
	};

	// profile image preview url cleanup (cleanup callback is executed before next effect / component unmount)
	useEffect(() => {
		return () => {
			if (profilePreviewUrl?.startsWith('blob:')) {
				URL.revokeObjectURL(profilePreviewUrl);
			}
		};
	}, [profilePreviewUrl])

	return (
		<div className={styles.profileContainer}>
			<div className={styles.profileRow}>
				<div className={styles.profileImgWrapper}>
					<img
						src={profilePreviewUrl}
						alt="profile img"
						onError={handleImageError}
					/>
					{isEditmode && (
						<label htmlFor="profile-image" className={styles.editButton}>
							<input
								id="profile-image"
								className={styles.editInput}
								type="file"
								accept="image/*"
								onChange={handleImageChange}
							/>
							<FaCamera color="ABABAB" size={13} />
						</label>
					)}
				</div>
				<div className={styles.nameEmailCol}>
					{isEditmode ? (
						<input
							className={styles.nameInput}
							type="text"
							value={username}
							placeholder="이름을 입력하세요"
							onChange={(e) => setUsername(e.currentTarget.value)}
							onKeyDown={(e: React.KeyboardEvent) => {
								if (e.key === "Enter" && !e.nativeEvent.isComposing) {
									e.stopPropagation();
									e.preventDefault();
									handleChangesSave();
								}
							}}
						/>
					) : (
						<span className={styles.nameText}>{user?.username}</span>
					)}
					<span
						className={`${styles.emailText} ${isEditmode ? styles.edit : ""}`}
					>
						{user?.email}
					</span>
				</div>
				{isEditmode ? (
					<IoMdDoneAll
						onClick={handleChangesSave}
						className={styles.editBtn}
						size={20}
						color="ABABAB"
					/>
				) : (
					<RiPencilFill
						className={styles.editBtn}
						color="ABABAB"
						size={24}
						onClick={() => setIsEditmode(true)}
					/>
				)}
			</div>
			<button
				type="button"
				className={styles.timeTableBtn}
				onClick={() => navigate("/timetable")}
			>
				{timetables && timetables.length > 0 ? (
					<>
						<img src="/assets/radio.svg" alt="a plus button" />
						<span>내 시간표 등록하기</span>
					</>
				) : (
					<>
						<img
							src="/assets/timetableActive.png"
							alt="a colored timetable icon"
						/>
						<span>내 시간표 수정하기</span>
					</>
				)}
			</button>
		</div>
	);
};

const MyPage = () => {
	const { user } = useAuth();

	return (
		<main>
			<Navigationbar />
			{user ? (
				<div className={styles.mypageContainer}>
					<ProfileCard />
					<div className={styles.widgetsWrapper}>
						<BookmarkWidget />
						<MemoWidget />
					</div>
				</div>
			) : (
				<div className={styles.notFound}>{/* Login modal */}</div>
			)}
		</main>
	);
};

export default MyPage;
