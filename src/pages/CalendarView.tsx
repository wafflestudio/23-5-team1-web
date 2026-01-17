import { useEffect, useState } from "react";
import { Views } from "react-big-calendar";
import { useEvents } from "../contexts/EventContext";
import { useFilter } from "../contexts/FilterContext";
import styles from "../styles/CalendarView.module.css";
import type { CalendarEvent, FetchMonthEventArgs } from "../util/types";
import DetailView from "../widgets/DetailView";
import MonthSideView from "../widgets/MonthSideView";
import { MyCalendar } from "../widgets/MyCalendar";
import { Sidebar } from "../widgets/Sidebar";

const CalendarView = () => {
	const { monthViewData, fetchMonthEvents } = useEvents();
	const { globalCategory, globalOrg, globalStatus } = useFilter();

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
			const param: FetchMonthEventArgs = {};
			if (globalCategory) param.eventTypeId = globalCategory.map((g) => g.id);
			if (globalOrg) param.orgId = globalOrg.map((g) => g.id);
			if (globalStatus) param.statusId = globalStatus.map((g) => g.id);

			await fetchMonthEvents(param);
		};
		loadEvents();
	}, [fetchMonthEvents, globalCategory, globalOrg, globalStatus]);

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
		<div className={styles.container}>
			<div className={styles.sidebarContainer}>
				<Sidebar />
			</div>
			<div className={styles.calendarContainer}>
				<div className={styles.calendarWrapper}>
					<MyCalendar
						events={MONTH_EVENTS}
						onShowMoreClick={onShowMoreClick}
						onSelectEvent={onSelectEvent}
					/>
				</div>
				{showSideMonth && (
					<div className={styles.sidePanel}>
						<MonthSideView day={clickedDate} onClose={handleCloseSideMonth} />
					</div>
				)}

				{showDetailView && clickedEventId !== undefined && (
					<div className={styles.sidePanel}>
						<DetailView eventId={clickedEventId} onClose={handleCloseDetail} />
					</div>
				)}
			</div>
		</div>
	);
};

export default CalendarView;
