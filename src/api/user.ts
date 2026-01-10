import type { Category, Event } from "../util/types";
import api from "./axios";

// --- Bookmarks ---
export const getBookmarks = async (page = 1) => {
	const res = await api.get<{ items: Event[] }>("/users/me/bookmarks", {
		params: { page },
	});
	return res.data;
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

export const addInterestCategory = async (categoryId: number) => {
	await api.post("/users/me/interestCategories", { categoryId });
};

export const removeInterestCategory = async (categoryId: number) => {
	await api.delete(`/users/me/interestCategories/${categoryId}`);
};
