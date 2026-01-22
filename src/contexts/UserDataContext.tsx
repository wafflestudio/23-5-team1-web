import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import * as userService from "@api/user";
import type { Category, Event } from "@types";
import { useAuth } from "./AuthProvider";

interface UserDataContextType {
	bookmarkedEvents: Event[];
	interestCategories: Category[];
	refreshUserData: () => void;
	toggleBookmark: (event: Event) => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
	undefined,
);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated } = useAuth();

	const [bookmarkedEvents, setBookmarkedEvents] = useState<Event[]>([]);
	const [interestCategories, setInterestCategories] = useState<Category[]>([]);

	const fetchAll = useCallback(async () => {
		if (!isAuthenticated) return;
		try {
			// Parallel fetch for efficiency
			const [bookmarksData, interestsData] = await Promise.all([
				userService.getBookmarks(1), // Fetch first page/all
				userService.getInterestCategories(),
			]);
			setBookmarkedEvents(bookmarksData);
			setInterestCategories(interestsData);
		} catch (error) {
			console.error("Failed to load user data", error);
		}
	}, [isAuthenticated]);

	useEffect(() => {
		if (isAuthenticated) {
			fetchAll();
		} else {
			setBookmarkedEvents([]);
			setInterestCategories([]);
		}
	}, [isAuthenticated, fetchAll]);

	// Optimistic UI Update for Bookmarking
	const toggleBookmark = async (event: Event) => {
		const isBookmarked = bookmarkedEvents.some((b) => b.id === event.id);

		// 1. Optimistic Update
		if (isBookmarked) {
			setBookmarkedEvents((prev) => prev.filter((b) => b.id !== event.id));
		} else {
			setBookmarkedEvents((prev) => [...prev, event]);
		}

		// 2. API Call
		try {
			if (isBookmarked) {
				await userService.removeBookmark(event.id);
			} else {
				await userService.addBookmark(event.id);
			}
		} catch (error) {
			// Revert on failure
			fetchAll();
			console.error(error);
			alert("Failed to update bookmark");
		}
	};

	return (
		<UserDataContext.Provider
			value={{
				bookmarkedEvents,
				interestCategories,
				refreshUserData: fetchAll,
				toggleBookmark,
			}}
		>
			{children}
		</UserDataContext.Provider>
	);
};

export const useUserData = () => {
	const context = useContext(UserDataContext);
	if (!context) throw new Error("useUserData error");
	return context;
};
