import type { Course, Day, TimeSlot } from "../../util/types";

export type GridConfig = {
	startHour: number; // 화면 시작 시간
	endHour: number; //화면 끝 시간
	ppm: number; // pixels per minute
};

export type PositionedBlock = {
	id: number;
	courseNumber?: string;
	lectureNumber?: string;
	title: string;
	day: Day;
	top: number;
	height: number;
	startMin: number;
	endMin: number;
};

function minutesToTop(min: number, cfg: GridConfig) {
	const startMin = cfg.startHour * 60;
	return (min - startMin) * cfg.ppm;
}

function durationToHeight(startMin: number, endMin: number, cfg: GridConfig) {
	return (endMin - startMin) * cfg.ppm;
}

export function flattenToBlocks(
	courses: Course[],
	cfg: GridConfig,
): PositionedBlock[] {
	const blocks: PositionedBlock[] = [];
	for (const course of courses) {
		course.slot.forEach((slot: TimeSlot) => {
			blocks.push({
				id: course.id,
				courseNumber: course.courseNumber,
				lectureNumber: course.lectureNumber,
				title: course.courseTitle,
				day: slot.day,
				startMin: slot.startMin,
				endMin: slot.endMin,
				top: minutesToTop(slot.startMin, cfg),
				height: durationToHeight(slot.startMin, slot.endMin, cfg),
			});
		});
	}

	return blocks;
}

// 겹침 체크
export function hasOverlap(existing: TimeSlot[], next: TimeSlot) {
	return existing.some(
		(s) =>
			s.day === next.day &&
			next.startMin < s.endMin &&
			s.startMin < next.endMin,
	);
}
