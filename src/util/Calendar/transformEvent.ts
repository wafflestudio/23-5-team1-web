import type { Event, EventDTO } from "@types";

export const transformEvent = (dto: EventDTO): Event => {
	const today = new Date();
	return {
		...dto,
		eventTypeId:
			dto.eventTypeId && dto.eventTypeId <= 6 && dto.eventTypeId >= 1
				? dto.eventTypeId
				: 6,
		applyStart: new Date(dto.applyStart),
		applyEnd: new Date(dto.applyEnd),
		eventStart: dto.eventStart ? new Date(dto.eventStart) : null,
		eventEnd: dto.eventEnd ? new Date(dto.eventEnd) : null,

		statusId: dto.statusId
			? dto.statusId
			: new Date(dto.applyEnd) < today
				? 3
				: 1,
	};
};
