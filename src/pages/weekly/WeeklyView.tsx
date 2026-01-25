import { useEvents } from "../../contexts/EventContext";
import { formatDateToYYYYMMDD } from "../../util/Calendar/dateFormatter";
import type { FetchWeekEventArgs, Event, CalendarEvent } from "../../util/types";
import { config, flattenEventsToBlocks } from "../../util/weekly_timetable/layout";
import { WeekGrid } from "../components/WeekGrid";
import { useEffect, useState } from "react";
import { Sidebar } from "../../widgets/Sidebar";
import DetailView from "../../widgets/DetailView";
import styles from "../../styles/CalendarView.module.css";

export function WeeklyView() {
    const {weekViewData, fetchWeekEvents} = useEvents();
	const [showDetailView, setShowDetailView] = useState<boolean>(false);
	const [clickedEventId, setClickedEventId] = useState<number>();

	useEffect(() => {
		const loadEvents = async () => {
			const params:FetchWeekEventArgs = getWeekRange();

			await fetchWeekEvents(params);
		};
		loadEvents();
		const getWeekRange = () => {
			const now = new Date();
			const from = new Date(now);
			const day = now.getDay();
			from.setDate(from.getDate() - day);
			const to = new Date(now);
			to.setDate(to.getDate() + 6 - day)
			return {from: formatDateToYYYYMMDD(from), to: formatDateToYYYYMMDD(to)};
    	}
	}, [fetchWeekEvents])

	const weekEvents = Object.values(weekViewData?.byDate || {}).flatMap(
		(bucket) => bucket.preview,
	);

	const onSelectEvent = (event: CalendarEvent) => {
		// showSideMonth off, showDetailView on
		setShowDetailView(true);
		setClickedEventId(event.resource.event.id);
	};
	const handleCloseDetail = () => {
		setShowDetailView(false);
	};

    return(
		<div className={styles.container}>
			<div className={styles.sidebarContainer}>
				<Sidebar />
			</div>
			<div className={styles.calendarContainer}>
				<div className={styles.calendarWrapper}>
					<WeekGrid<Event>
						items={weekEvents}
						config={config}
						toBlocks={flattenEventsToBlocks}
						//onSelectBlock={onSelectEvent}
						// Weekly-timetable에서 onSelect 타입 정의 수정
					/>
				</div>
				{showDetailView && clickedEventId !== undefined && (
					<DetailView eventId={clickedEventId} onClose={handleCloseDetail} />
				)}
			</div>
		</div>
    )



}
