import { useEffect, useState } from "react";
import { Views } from "react-big-calendar";
import { useEvents } from "../contexts/EventContext";
import styles from "../styles/CalendarView.module.css";
import type { CalendarEvent } from "../util/types";
import DetailView from "../widgets/DetailView";
import MonthSideView from "../widgets/MonthSideView";
import { MyCalendar } from "../widgets/MyCalendar";
import { Sidebar } from "../widgets/Sidebar";

const CalendarView = () => {
	const { monthViewData, fetchMonthEvents } = useEvents();

	const [showSideMonth, setShowSideMonth] = useState<boolean>(false);
	const [showDetailView, setShowDetailView] = useState<boolean>(false);
	const [clickedDate, setClickedDate] = useState<Date>(new Date());
	const [clickedEventId, setClickedEventId] = useState<number>();

	// need to get month data from sidebar
	const MONTH_EVENTS = Object.values(monthViewData?.byDate || {}).flatMap(
		(bucket) => bucket.preview,
	);

	useEffect(() => {
		const loadEvents = async () => {
			await fetchMonthEvents({});
		};
		loadEvents();
	}, [fetchMonthEvents]);

	// click handler
	const onShowMoreClick = (date: Date, view: string) => {
		// showSideMonth on, showDetailView off
		if (view === Views.MONTH) {
			setShowSideMonth(true);
		}
		setShowDetailView(false);
		setClickedDate(date);
	};
	const onSelectEvent = (event: CalendarEvent) => {
		// showSideMonth off, showDetailView on
		setShowSideMonth(false);
		setShowDetailView(true);
		setClickedEventId(event.resource.event.id);
	};

	const handleCloseSideMonth = () => {
		setShowSideMonth(false);
	};
	const handleCloseDetail = () => {
		setShowDetailView(false);
	};

	return (
		<div>
			<div className={styles.sidebarContainer}>
				<Sidebar />
			</div>
			<div className={styles.calendarContainer}>
				<MyCalendar
					events={MONTH_EVENTS}
					onShowMoreClick={onShowMoreClick}
					onSelectEvent={onSelectEvent}
				/>
			</div>
			<div className={styles.sideviewContainer}>
				{showSideMonth && (
					<MonthSideView day={clickedDate} onClose={handleCloseSideMonth} />
				)}
				{showDetailView && clickedEventId !== undefined && (
					<DetailView eventId={clickedEventId} onClose={handleCloseDetail} />
				)}
			</div>
		</div>
	);
};

export default CalendarView;
