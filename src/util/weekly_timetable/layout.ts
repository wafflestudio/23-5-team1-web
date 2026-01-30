import type {
	Course,
	Day,
	TimeSlot,
	Event,
	GetCoursesResponse,
} from "../types";
import { dayOfWeekToDay } from "./time";

export type GridConfig = {
	startHour: number; // 화면 시작 시간
	endHour: number; //화면 끝 시간
	ppm: number; // pixels per minute
};

export type WeekGridBlock<T> = {
	id: number;
	day: Day;
	top: number;
	height: number;
	title: string;
	startMin: number;
	endMin: number;
	raw: T;
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
	events: Event[],
	cfg: GridConfig,
): WeekGridBlock<Event>[] {
	const blocks: WeekGridBlock<Event>[] = [];
	events.forEach((event) => {
		if (!event.eventStart || !event.eventEnd) return;
		blocks.push({
			id: event.id,
			title: event.title,
			day: toDay(event.eventStart.getDay()),
			top: minutesToTop(event.eventStart.getMinutes(), cfg),
			height: durationToHeight(
				event.eventStart.getMinutes(),
				event.eventEnd.getMinutes(),
				cfg,
			),
			startMin: event.eventStart.getMinutes(),
			endMin: event.eventEnd.getMinutes(),
			raw: event,
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
