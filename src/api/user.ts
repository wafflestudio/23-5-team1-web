import { transformEvent } from "@calendarUtil/transformEvent";
import type { Category, EventDTO, Memo, User } from "@types";
import api from "./axios";

// --- Excluded Keywords ---
export const getExcludedKeywords = async () => {
	interface Keywords {
		id: number;
		keyword: string;
		createdAt: string;
	}
	const res = await api.get<{ items: Keywords[] }>(
		"/users/me/excluded-keywords",
	);
	const keywords: { id: number; keyword: string }[] = res.data.items.map(
		(item: Keywords) => ({ id: item.id, keyword: item.keyword }),
	);

	return keywords;
};

export const addExcludedKeywords = async (keyword: string) => {
	await api.post("/users/me/excluded-keywords", {
		keyword,
	});
};

export const deleteExcludedKeywords = async (id: number) => {
	await api.delete(`/users/me/excluded-keywords/${id}`);
};

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

// --- Memos ---
export const getMemos = async (_user: User) => {
	const res = await api.get<{
		memos: {
			id: number;
			eventId: number;
			eventTitle: string;
			content: string;
			tags: string[];
			createdAt: string;
		}[];
	}>("/memos");
	const memos: Memo[] = res.data.memos.map((m) => ({
		id: m.id,
		eventId: m.eventId,
		eventTitle: m.eventTitle,
		content: m.content,
		tags: m.tags,
		createdAt: new Date(m.createdAt),
	}));

	return memos;
};

export const addMemo = async (eventId: number, content: string) => {
	await api.post(`/users/me/memos`, { eventId, content });
};
