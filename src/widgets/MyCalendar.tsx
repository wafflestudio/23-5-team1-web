import { useCallback, useMemo, useState } from "react";
import { Calendar, type View, Views } from "react-big-calendar";
import styles from "@styles/Calendar.module.css";
import { localizer } from "@calendarUtil/calendarLocalizer";
import type { CalendarEvent, Event } from "@types";
import Toolbar from "./Toolbar";
import MonthEvent from "./Month/MonthEvent";
import DayEvent from "./Day/DayEvent";
import CustomDayView from "./Day/CustomDayView";
import CustomWeekView from "./Week/CustomWeekView";
import { useEvents } from "@/contexts/EventContext";
import { isLongerThan } from "@calendarUtil/isLongerThan";

const eventPropGetter = () => {
	return {
		className: styles.resetEventStyle, // CSS 모듈로 기본 스타일 제거
	};
};

interface MyCalendarProps {
	monthEvents: Event[];
	weekEvents: Event[];
	dayEvents: Event[];
	onShowMoreClick: (date: Date, view: string) => void;
	onSelectEvent: (event: CalendarEvent) => void;
}

export const MyCalendar = ({
	monthEvents,
	weekEvents,
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
			case Views.MONTH:
				return monthEvents;
			case Views.WEEK:
				return weekEvents;
			case Views.DAY:
				return dayEvents;
			default:
				return monthEvents;
		}
	}, [currentView, monthEvents, weekEvents, dayEvents]);

	const CALENDER_EVENTS = useMemo(() => {
		return currentEvents.map((event: Event) => {
			let isPeriodEvent: boolean;
			if (!event.eventStart || !event.eventEnd) {
				// 기본 : eventStart 혹은 eventEnd가 없으면 기간제 행사 처리
				isPeriodEvent = true;
			} else if (
				event.title.includes("공모전") ||
				event.title.includes("인턴십") 
			) {
				// 인턴십, 공모전 : 신청형 기간제 행사임에도 eventStart, eventEnd 데이터가 들어있는 경우 있음
				// -> 일괄적으로 기간제 행사 처리
				isPeriodEvent = true;
			} else if (isLongerThan(event.eventStart, event.eventEnd, 7)) {
				// eventEnd-eventStart > 일주일 에 해당하는 긴 행사들의 경우, 차라리 기간제 행사처럼 처리
				isPeriodEvent = true;
			} else {
				// 이외 : eventStart & eventEnd가 있음
				isPeriodEvent = false;
			}

			const startDate = (isPeriodEvent ? event.applyStart  : event.eventStart) || event.eventStart || event.applyStart;
			const endDate = (isPeriodEvent ? event.applyEnd  : event.eventEnd) || event.eventEnd || event.applyEnd;
			const isAllDay = currentView === Views.MONTH ? true : isPeriodEvent;

			return {
				start: startDate,
				end: endDate,
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
					week: CustomWeekView,
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
