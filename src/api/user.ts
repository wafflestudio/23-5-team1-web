import { transformEvent } from "../util/Calendar/transformEvent";
import type { Category, EventDTO } from "../util/types";
import api from "./axios";

// --- Bookmarks ---
export const getBookmarks = async (page = 1, size = 20) => {
	const res = await api.get<{ items: EventDTO[] }>("/users/me/bookmarks", {
		params: { page, size },
	});

	const result = res.data.items.map(transformEvent);

	return result;
};

export const addBookmark = async (eventId: number) => {
	await api.post(`/events/${eventId}/bookmark`);
};

export const removeBookmark = async (eventId: number) => {
	await api.delete(`/events/${eventId}/bookmark`);
};

// --- Interests ---
export const getInterestCategories = async () => {
	const res = await api.get<Category[]>("/users/me/interestCategories");
	return res.data;
};

export const addInterestCategory = async (
	categoryId: number,
	sortOrder: number,
) => {
	await api.post("/users/me/interestCategories", { categoryId, sortOrder });
};

export const removeInterestCategory = async (categoryId: number) => {
	await api.delete(`/users/me/interestCategories/${categoryId}`);
};

export const addMemo = async (eventId: number, content: string) => {
	await api.post(`/users/me/memos`, { eventId, content });
};
