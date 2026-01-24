import {
	useCallback,
	useMemo,
	useState,
} from "react";
import { Calendar, type View, Views } from "react-big-calendar";
import styles from "@styles/Calendar.module.css";
import { localizer } from "@calendarUtil/calendarLocalizer";
import type { CalendarEvent, Event } from "@types";
import Toolbar from "./Toolbar";
import MonthEvent from "./Month/MonthEvent";
import DayEvent from "./Day/DayEvent";
import CustomDayView from "./Day/CustomDayView";
import { useEvents } from "@/contexts/EventContext";

const eventPropGetter = () => {
	return {
		className: styles.resetEventStyle, // CSS 모듈로 기본 스타일 제거
	};
};

interface MyCalendarProps {
	monthEvents: Event[];
	dayEvents: Event[];
	onShowMoreClick: (date: Date, view: string) => void;
	onSelectEvent: (event: CalendarEvent) => void;
}

export const MyCalendar = ({
	monthEvents,
	dayEvents,
	onShowMoreClick,
	onSelectEvent,
}: MyCalendarProps) => {
	const { dayDate, setDayDate } = useEvents();
	const [currentView, setCurrentView] = useState<View>(Views.MONTH);

	const onNavigate = useCallback(
		(newDate: Date) => {
			setDayDate(newDate);
		},
		[setDayDate],
	);



	const currentEvents = useMemo(() => {
		switch (currentView) {
			case Views.MONTH: return monthEvents;
			 /* TODO : make week data */
			case Views.DAY: return dayEvents;
			default:
				return monthEvents;
		}
	}, [currentView, monthEvents, dayEvents]);

	const CALENDER_EVENTS = useMemo(() => {
		return currentEvents.map((event: Event) => {
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
	}, [currentEvents, currentView]);

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
			timeGutterFormat: "h a",
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

	const messages = useMemo(
		() => ({
			showMore: (total: number) => `+${total}`,
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
					// event: MonthEvent,
					month: {
						event: MonthEvent,
					},
					day: {
						event: DayEvent,
					},
				}}
				// style function
				eventPropGetter={eventPropGetter}
				date={dayDate}
				// view setup
				view={currentView}
				onView={(view) => setCurrentView(view)}
				views={{
					month: true,
					week: true,
					day: CustomDayView,
				}}
				onNavigate={onNavigate}
				defaultView={Views.MONTH}
				// 한국어 형식
				formats={formats}
				// 더보기 눌렀을 때 popup 나타나기 X, 사이드뷰 나타남
				popup={false}
				onDrillDown={(date: Date) => {
					onShowMoreClick(date, Views.MONTH);
				}}
				// 더보기 미리보기
				messages={messages}
				// 행사 눌렀을 때 상세 뷰 나타나게 하기 :
				onSelectEvent={onSelectEvent}
			/>
		</div>
	);
};
