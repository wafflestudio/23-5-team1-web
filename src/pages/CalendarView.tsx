import { useEffect } from "react";
import { useEvents } from "../contexts/EventContext";
import { MyCalendar } from "../widgets/MyCalendar";

const CalendarView = () => {
	const { monthViewData, fetchMonthEvents } = useEvents();
	// need to get month data from sidebar

	useEffect(() => {
		fetchMonthEvents;
	}, [fetchMonthEvents]);

	return <MyCalendar />;
};

export default CalendarView;
