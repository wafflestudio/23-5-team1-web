import { useMemo, useState } from "react";
import { Calendar, type View, Views } from "react-big-calendar";
import styles from "../styles/Calendar.module.css";
import { localizer } from "../util/Calendar/calendarLocalizer";
import type { Event } from "../util/types";
import Toolbar from "./Toolbar";

interface CalendarEvent {
	start: Date;
	end: Date;
	title: string;
	// 'block' event( 행사) : allDay===true
	allDay: boolean;
	resource: {
		event: Event;
		isPeriodEvent: boolean;
	};
}

const categoryColors: Record<number, string> = {
	1: "rgba(208, 183, 82, 0.6)",
	2: "rgba(11, 206, 132, 0.6)",
	3: "rgba(11, 206, 132, 0.6)",
	4: "rgba(0, 136, 255, 0.6)",
	5: "rgba(162, 90, 255, 0.6)",
	999: "rgba(255, 45, 85, 0.6)",
};

const eventPropGetter = () => {
	return {
		className: styles.resetEventStyle, // CSS 모듈로 기본 스타일 제거
	};
};

const CustomEvent = ({ event: calendarEvent }: { event: CalendarEvent }) => {
	const { isPeriodEvent, event } = calendarEvent.resource;
	const color = categoryColors[event.eventTypeId] || categoryColors[999];

	// 기간제 행사 : 화살표
	if (isPeriodEvent) {
		return (
			<div className={styles.arrowEventContainer} style={{ color: color }}>
				<span className={styles.arrowText}>{event.title}</span>
				<div className={styles.arrowLine} style={{ backgroundColor: color }}>
					<div
						className={styles.arrowHead}
						style={{ borderLeftColor: color }}
					/>
				</div>
			</div>
		);
	}
	// 단발성 행사 : 블록
	return (
		<div
			className={styles.blockEventContainer}
			style={{ backgroundColor: color }}
		>
			{event.title}
		</div>
	);
};

export const MyCalendar = ({ events }: { events: Event[] }) => {
	const [currentView, setCurrentView] = useState<View>(Views.MONTH);

	const CALENDER_EVENTS = useMemo(() => {
		return events.map((event: Event) => {
			const isPeriodEvent = !event.eventStart; // 기간제 여부
			const startDate = event.eventStart || event.applyStart;
			const endDate = event.eventEnd || event.applyEnd;

			let isAllDay: boolean;

			if (currentView === Views.MONTH) {
				isAllDay = true;
			} else {
				isAllDay = isPeriodEvent;
			}

			return {
				start: new Date(startDate),
				end: new Date(endDate),
				title: event.title,
				allDay: isAllDay,
				resource: { event, isPeriodEvent },
			};
		});
	}, [events, currentView]);

	return (
		<div className={styles.calendarContainer}>
			<Calendar
				localizer={localizer}
				events={CALENDER_EVENTS}
				startAccessor="start"
				endAccessor="end"
				style={{ height: 800 }}
				// custom toolbar
				components={{
					toolbar: Toolbar,
					event: CustomEvent,
				}}
				// style function
				eventPropGetter={eventPropGetter}
				// view setup
				view={currentView}
				onView={(view) => setCurrentView(view)}
				views={[Views.MONTH, Views.WEEK, Views.DAY]}
				defaultView={Views.MONTH}
				// 한국어 형식
				formats={{
					monthHeaderFormat: "yyyy년 M월",
				}}
			/>
		</div>
	);
};
