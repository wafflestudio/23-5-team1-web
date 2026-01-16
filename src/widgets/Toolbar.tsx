import { type View, Views } from "react-big-calendar";
import { IoIosSearch } from "react-icons/io";
import { useAuth } from "../contexts/AuthProvider";
import styles from "../styles/Toolbar.module.css";

interface ToolbarProps {
	view: View;
	onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
	onView: (view: View) => void;
	label: string;
}

const Toolbar: React.FC<ToolbarProps> = ({
	view,
	onNavigate,
	onView,
	label,
}) => {
	const { user } = useAuth();

	return (
		<div className={styles.toolbarContainer}>
			{/* 월/주/일 토글 버튼 */}
			<div className={styles.centerControl}>
				<div className={styles.viewToggleGroup}>
					<button
						type="button"
						onClick={() => onView(Views.MONTH)}
						className={`${styles.toggleBtn} ${view === Views.MONTH ? styles.toggleBtnActive : ""}`}
					>
						월
					</button>
					<button
						type="button"
						onClick={() => onView(Views.WEEK)}
						className={`${styles.toggleBtn} ${view === Views.WEEK ? styles.toggleBtnActive : ""}`}
					>
						주
					</button>
					<button
						type="button"
						onClick={() => onView(Views.DAY)}
						className={`${styles.toggleBtn} ${view === Views.DAY ? styles.toggleBtnActive : ""}`}
					>
						일
					</button>
				</div>
			</div>

			{/* 날짜 및 내비게이션 */}
			<div className={styles.headerRow}>
				<div className={styles.leftGroup}>
					<h2 className={styles.dateTitle}>{label}</h2>
					<div className={styles.navBtnGroup}>
						<button
							type="button"
							className={styles.todayBtn}
							onClick={() => onNavigate("TODAY")}
						>
							오늘
						</button>
						<button
							type="button"
							className={styles.navIconBtn}
							onClick={() => onNavigate("PREV")}
						>
							&lt;
						</button>
						<button
							type="button"
							className={styles.navIconBtn}
							onClick={() => onNavigate("NEXT")}
						>
							&gt;
						</button>
					</div>
				</div>

				<div className={styles.rightGroup}>
					<IoIosSearch size={20} color="rgba(130, 130, 130, 1)" />
					<button type="button" className={styles.profileButton}>
						<img
							alt="user profile"
							src={user?.profileImageUrl || "/assets/defaultProfile.png"}
						/>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Toolbar;
