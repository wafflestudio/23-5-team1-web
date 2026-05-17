import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@styles/CalendarView.module.css";
import MonthSideView from "@widgets/Month/MonthSideView/MonthSideView";
import DetailView from "@/widgets/DetailView";
import BottomNav from "@/widgets/BottomNav";
import { useEvents } from "@/contexts/EventContext";
import { useDetail } from "@/contexts/DetailContext";
import { FilterSheet } from "@/widgets/FilterSheet/FilterSheet";
import Modal from "@/widgets/Modal";

const MOBILE_MAX_WIDTH = 576;

const MainDay = () => {
	const navigate = useNavigate();
	const { dayDate } = useEvents();
	const { showDetail, clickedEventId } = useDetail();
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);


	useEffect(() => {
		const checkWidth = () => {
			if (window.innerWidth > MOBILE_MAX_WIDTH) {
				navigate("/main", { replace: true });
			}
		};
		checkWidth();
		window.addEventListener("resize", checkWidth);
		return () => window.removeEventListener("resize", checkWidth);
	}, [navigate]);

	const handleClose = () => {
		navigate("/main");
	};

	return (
		<div className={`${styles.container} ${styles.mainDay}`}>
			<div className={styles.calendarContainer}>
				<MonthSideView day={dayDate} onClose={handleClose} onLoginPrompt={()=>setIsLoginModalOpen(true)} />
				{showDetail && clickedEventId !== undefined && (
					<div className={`${styles.sidePanel} ${styles.detailPanel}`}>
						<DetailView eventId={clickedEventId} />
					</div>
				)}
			</div>
			<FilterSheet />
			{!showDetail && <BottomNav />}
			{isLoginModalOpen && (
				<Modal
					content="로그인 이후 이용해주세요"
					leftText="로그인"
					rightText="닫기"
					onLeftClick={() => navigate("/")}
					onRightClick={() => setIsLoginModalOpen(false)}
					onClose={() => setIsLoginModalOpen(false)}
				/>
			)}

		</div>
	);
};

export default MainDay;
