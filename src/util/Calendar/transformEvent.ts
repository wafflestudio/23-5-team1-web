import type { Event, EventDTO } from "../types";

export const transformEvent = (dto: EventDTO): Event => {
	return {
		...dto,
		applyStart: new Date(dto.applyStart),
		applyEnd: new Date(dto.applyEnd),
		eventStart: new Date(dto.eventStart),
		eventEnd: new Date(dto.eventEnd),
		tags: dto.tags.map((t) => t.name) || [],
	};
};
