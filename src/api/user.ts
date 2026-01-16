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
	const res = await api.get<Category[]>("/users/me/interest-categories");
	return res.data;
};

export const addInterestCategories = async (
  items: { categoryId: number; priority: number }[],
) => {
  return api.put("/users/me/interest-categories", { items });
};

export const removeInterestCategory = async (categoryId: number) => {
	await api.delete(`/users/me/interest-categories/${categoryId}`);
};

export const addMemo = async (eventId: number, content: string) => {
	await api.post(`/users/me/memos`, { eventId, content });
};
