import { useCallback, useMemo, useState } from "react";
import { Calendar, type View, Views } from "react-big-calendar";
import styles from "../styles/Calendar.module.css";
import { localizer } from "../util/Calendar/calendarLocalizer";
import { CATEGORY_COLORS } from "../util/constants";
import type { CalendarEvent, Event } from "../util/types";
import Toolbar from "./Toolbar";

const eventPropGetter = () => {
	return {
		className: styles.resetEventStyle, // CSS 모듈로 기본 스타일 제거
	};
};

const CustomEvent = ({ event: calendarEvent }: { event: CalendarEvent }) => {
	const { isPeriodEvent, event } = calendarEvent.resource;
	const color = CATEGORY_COLORS[event.eventTypeId] || CATEGORY_COLORS[999];

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

interface MyCalendarProps {
	events: Event[];
	onShowMoreClick: (date: Date, view: string) => void;
	onSelectEvent: (event: CalendarEvent) => void;
}

export const MyCalendar = ({
	events,
	onShowMoreClick,
	onSelectEvent,
}: MyCalendarProps) => {
	const [date, setDate] = useState(new Date());
	const [currentView, setCurrentView] = useState<View>(Views.MONTH);

	const onNavigate = useCallback((newDate: Date) => {
		setDate(newDate);
	}, []);

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

	const formats = useMemo(
		() => ({
			monthHeaderFormat: "yyyy년 M월",
			dayHeaderFormat: "M월 d일 EEE",
			weekdayFormat: (date: Date) => {
				const days = ["일", "월", "화", "수", "목", "금", "토"];
				return days[date.getDay()];
			},
			dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
				const startDate = start.toLocaleDateString("ko-KR", {
					month: "long",
					day: "numeric",
				});
				const endDate = end.toLocaleDateString("ko-KR", {
					month: "long",
					day: "numeric",
				});
				return `${startDate} – ${endDate}`;
			},
			timeGutterFormat: "a h:mm",
			eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
				return `${start.toLocaleTimeString("ko-KR", {
					hour: "numeric",
					minute: "2-digit",
				})} – ${end.toLocaleTimeString("ko-KR", {
					hour: "numeric",
					minute: "2-digit",
				})}`;
			},
		}),
		[],
	);

	return (
		<div className={styles.calendarContainer}>
			<Calendar
				localizer={localizer}
				events={CALENDER_EVENTS}
				startAccessor="start"
				endAccessor="end"
				style={{ height: "100%" }}
				// custom toolbar
				components={{
					toolbar: Toolbar,
					event: CustomEvent,
				}}
				// style function
				eventPropGetter={eventPropGetter}
				date={date}
				// view setup
				view={currentView}
				onView={(view) => setCurrentView(view)}
				views={[Views.MONTH, Views.WEEK, Views.DAY]}
				onNavigate={onNavigate}
				defaultView={Views.MONTH}
				// 한국어 형식
				formats={formats}
				// 더보기 눌렀을 때 popup 나타나기 X, 사이드뷰 나타남
				popup={false}
				onDrillDown={onShowMoreClick}
				// 행사 눌렀을 때 상세 뷰 나타나게 하기 :
				onSelectEvent={onSelectEvent}
			/>
		</div>
	);
};
