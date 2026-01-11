import type {
	CategoryGroupWithCategories,
	Event,
	MonthViewParams,
} from "../util/types";
import api from "./axios";

// Needed : mapResToEvent func & API response interface

export const getMonthEvents = async (params: MonthViewParams) => {
	const res = await api.get("/events/month", { params });
	return res.data;
};

export const getDayEvents = async (date: string, page = 1) => {
	const res = await api.get("/events/day", { params: { date, page } });
	return res.data;
};

export const getEventDetail = async (eventId: number) => {
	const res = await api.get<Event>(`/events/${eventId}`);
	return res.data;
};

export const getCategories = async () => {
	const res = await api.get<CategoryGroupWithCategories[]>("/categoryGroups");
	return res.data;
};
