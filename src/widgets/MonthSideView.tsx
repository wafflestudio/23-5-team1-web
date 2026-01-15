// 필요 : get events by day (get all)
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaAnglesRight } from "react-icons/fa6";
import { useEvents } from "../contexts/EventContext";
import styles from "../styles/DaySideView.module.css";
import CardView from "./CardView";

const MonthSideView = ({
	day,
	onClose,
}: {
	day: Date;
	onClose: () => void;
}) => {
	const { fetchDayEvents, dayViewEvents } = useEvents();
	const [date, setDate] = useState<Date>(day);

	useEffect(() => {
		const loadEvents = async () => {
			await fetchDayEvents({
				date,
			});
		};
		loadEvents();
	}, [fetchDayEvents, date]);

	const handleClickToday = () => {
		setDate(new Date());
	};
	const handleClickPrevday = () => {
		const prevDate = new Date(date);
		prevDate.setDate(date.getDate() - 1);
		setDate(prevDate);
	};
	const handleClickNextday = () => {
		const nextDate = new Date(date);
		nextDate.setDate(date.getDate() + 1);
		setDate(nextDate);
	};

	return (
		<div className={styles.mainWrapper}>
			<FaAnglesRight
				width={18}
				color="rgba(171, 171, 171, 1)"
				onClick={onClose}
			/>
			<div className={styles.dateRow}>
				<h1>{`${date.getMonth() + 1}월 ${date.getDate()}일`}</h1>
				<button type="button" onClick={handleClickToday}>
					오늘
				</button>
				<button type="button" onClick={handleClickPrevday}>
					<FaAngleLeft width={18} color="rgba(171, 171, 171, 1)" />
				</button>
				<button type="button" onClick={handleClickNextday}>
					<FaAngleRight width={18} color="rgba(171, 171, 171, 1)" />
				</button>
			</div>
			<div className={styles.cardWrapper}>
				{dayViewEvents.map((event) => (
					<CardView key={event.id} event={event} />
				))}
			</div>
		</div>
	);
};

export default MonthSideView;
