import { useEffect } from "react";
import { useEvents } from "../contexts/EventContext";
import { MyCalendar } from "../widgets/MyCalendar";
import { Sidebar } from "../widgets/Sidebar";

const CalendarView = () => {
	const { monthViewData, fetchMonthEvents } = useEvents();
	// need to get month data from sidebar

	const MONTH_EVENTS = Object.values(monthViewData?.byDate || {}).flatMap(
		(bucket) => bucket.preview,
	);

	useEffect(() => {
		fetchMonthEvents({});
	}, [fetchMonthEvents]);

	return (
		<div>
			<Sidebar />
			<MyCalendar events={MONTH_EVENTS} />
		</div>
	);
	// return <MyCalendar />;
};

export default CalendarView;
