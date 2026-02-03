import type {
	Course,
	Day,
	TimeSlot,
	GetCoursesResponse,
	CalendarEvent,
} from "../types";
import { dayOfWeekToDay, toMinutesOfDay } from "./time";

export type GridConfig = {
	startHour: number; // 화면 시작 시간
	endHour: number; //화면 끝 시간
	ppm: number; // pixels per minute
};

export type WeekGridBlock = {
	blockId: number;
	sourceId: number;
	day: Day;
	top: number;
	height: number;
	title: string;
	startMin: number;
	endMin: number;
	raw: CalendarEvent;
};

export type TimetableGridBlock<T> = {
	id: number;
	enrollId: number;
	day: Day;
	top: number;
	height: number;
	title: string;
	startMin: number;
	endMin: number;
	raw: T;
};

function minutesToTop(min: number, cfg: GridConfig) {
	const startMin = cfg.startHour * 60;
	return (min - startMin) * cfg.ppm;
}

function durationToHeight(startMin: number, endMin: number, cfg: GridConfig) {
	return (endMin - startMin) * cfg.ppm;
}

function toDay(d: number): Day {
	if (d < 0 || d > 6) {
		throw new Error(`Invalid day value: ${d}`);
	}
	return d as Day;
}

export function flattenCoursesToBlocks(
	coursesRes: GetCoursesResponse[],
	cfg: GridConfig,
): TimetableGridBlock<Course>[] {
	const blocks: TimetableGridBlock<Course>[] = [];
	for (const courseRes of coursesRes) {
		courseRes.course.timeSlots.forEach((slot: TimeSlot) => {
			blocks.push({
				id: courseRes.course.id,
				enrollId: courseRes.enrollId,
				title: courseRes.course.courseTitle,
				day: dayOfWeekToDay(slot.dayOfweek),
				startMin: slot.startAt,
				endMin: slot.endAt,
				top: minutesToTop(slot.startAt, cfg),
				height: durationToHeight(slot.startAt, slot.endAt, cfg),
				raw: courseRes.course,
			});
		});
	}

	return blocks;
}

export function flattenEventsToBlocks(
	cevents: CalendarEvent[],
	cfg: GridConfig,
): WeekGridBlock[] {
	const blocks: WeekGridBlock[] = [];

	cevents.forEach((cevent, idx) => {
		const start = cevent.resource.event.eventStart;
		const end = cevent.resource.event.eventEnd;

		if (!start || !end) return;

		// if (
		// 	start.getFullYear() !== end.getFullYear() ||
		// 	start.getMonth() !== end.getMonth() ||
		// 	start.getDate() !== end.getDate()
		// ) return;

		const startMin = toMinutesOfDay(start);
		const endMin = toMinutesOfDay(end);

		blocks.push({
			blockId: idx,
			sourceId: cevent.resource.event.id,
			title: cevent.title,
			day: toDay(start.getDay()),
			top: minutesToTop(startMin, cfg),
			height: durationToHeight(startMin, endMin, cfg),
			startMin,
			endMin,
			raw: cevent,
		});
	});

	return blocks;
}


// 겹침 체크
export function hasOverlap(existing: TimeSlot[], next: TimeSlot) {
	return existing.some(
		(s) =>
			s.dayOfweek === next.dayOfweek &&
			next.startAt < s.endAt &&
			s.startAt < next.endAt,
	);
}

export const config: GridConfig = {
	startHour: 0,
	endHour: 24,
	ppm: 0.9,
};
