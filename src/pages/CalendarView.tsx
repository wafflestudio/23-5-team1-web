import { useEffect, useState } from "react";
import { Views } from "react-big-calendar";
import { useEvents } from "@contexts/EventContext";
import { useFilter } from "@contexts/FilterContext";
import styles from "@styles/CalendarView.module.css";
import type {
	CalendarEvent,
	FetchDayEventArgs,
	FetchMonthEventArgs,
} from "@types";
import DetailView from "@widgets/DetailView";
import MonthSideView from "@widgets/Month/MonthSideView/MonthSideView";
import { MyCalendar } from "@widgets/MyCalendar";
import { Sidebar } from "@widgets/Sidebar";
import { useDetail } from "@contexts/DetailContext";

const CalendarView = () => {
	const {
		monthViewData,
		fetchMonthEvents,
		dayViewEvents,
		fetchDayEvents,
		dayDate,
	} = useEvents();
	const { globalCategory, globalOrg, globalStatus } = useFilter();
	// detail 보이는 뷰 조정
	const { showDetail, setShowDetail, clickedEventId, setClickedEventId } =
		useDetail();

	// 현재 기준점이 되는 날짜
	const [currentDate, setCurrentDate] = useState<Date>(new Date());

	// 월별 뷰 - 날짜 사이드 뷰
	const [showSideMonth, setShowSideMonth] = useState<boolean>(false);
	const [clickedDate, setClickedDate] = useState<Date>(new Date());

	// need to get month data from sidebar
	// const MONTH_EVENTS = Object.values(monthViewData?.byDate || {}).flatMap(
	// 	(bucket) => bucket.preview,
	// );
	const rawMonthEvents = Object.values(monthViewData?.byDate || {}).flatMap(
		(bucket) => bucket.events,
	);
	const MONTH_EVENTS = Array.from(
		new Map(rawMonthEvents.map((event) => [event.id, event])).values(),
	);

	// Day context data doesn't need additional transformation; it is returned as Event[]
	useEffect(() => {
		setCurrentDate(dayDate);
		console.log(rawMonthEvents);
	}, [dayDate, rawMonthEvents]);

	useEffect(() => {
		const loadMonthEvents = async () => {
			const paramMonth: FetchMonthEventArgs = {
				start: currentDate,
			};
			if (globalCategory)
				paramMonth.eventTypeId = globalCategory.map((g) => g.id);
			if (globalOrg) paramMonth.orgId = globalOrg.map((g) => g.id);
			if (globalStatus) paramMonth.statusId = globalStatus.map((g) => g.id);

			await fetchMonthEvents(paramMonth);
		};
		loadMonthEvents();
	}, [currentDate, fetchMonthEvents, globalCategory, globalOrg, globalStatus]);

	useEffect(() => {
		const loadDayEvents = async () => {
			const paramDay: FetchDayEventArgs = {
				date: currentDate,
			};

			if (globalCategory)
				paramDay.eventTypeId = globalCategory.map((g) => g.id);
			if (globalOrg) paramDay.orgId = globalOrg.map((g) => g.id);
			if (globalStatus) paramDay.statusId = globalStatus.map((g) => g.id);

			await fetchDayEvents(paramDay);
		};
		loadDayEvents();
	}, [currentDate, fetchDayEvents, globalCategory, globalOrg, globalStatus]);

	// click handler
	const onShowMoreClick = (date: Date, view: string) => {
		// showSideMonth on, showDetailView off
		if (view === Views.MONTH) {
			setShowSideMonth(true);
		}
		setShowDetail(false);
		setClickedDate(date);
	};
	const onSelectEvent = (event: CalendarEvent) => {
		// showSideMonth off, showDetailView on
		setShowSideMonth(false);
		setShowDetail(true);
		setClickedEventId(event.resource.event.id);
	};

	const onShowDetail = () => {
		setShowSideMonth(false);
		setShowDetail(true);
	};

	const handleCloseSideMonth = () => {
		setShowSideMonth(false);
	};
	const handleCloseDetail = () => {
		setShowDetail(false);
	};

	return (
		<div className={styles.container}>
			<div className={styles.sidebarContainer}>
				<Sidebar />
			</div>
			<div className={styles.calendarContainer}>
				<div className={styles.calendarWrapper}>
					<MyCalendar
						monthEvents={MONTH_EVENTS}
						dayEvents={dayViewEvents}
						onShowMoreClick={onShowMoreClick}
						onSelectEvent={onSelectEvent}
					/>
				</div>
				{showSideMonth && (
					<div className={styles.sidePanel}>
						<MonthSideView
							day={clickedDate}
							onClose={handleCloseSideMonth}
							onDetailClick={onShowDetail}
						/>
					</div>
				)}

				{showDetail && clickedEventId !== undefined && (
					<div className={styles.sidePanel}>
						<DetailView eventId={clickedEventId} onClose={handleCloseDetail} />
					</div>
				)}
			</div>
		</div>
	);
};

export default CalendarView;
