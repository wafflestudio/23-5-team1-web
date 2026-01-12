import React, {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	getCategoryGroups,
	getDayEvents,
	getEventDetail,
	getEventSearch,
	getMonthEvents,
	getOrganizations,
} from "../api/event";
import type {
	Category,
	CategoryGroupWithCategories,
	DayViewParams,
	Event,
	EventDetail,
	MonthViewParams,
	MonthViewResponse,
	SearchParams,
	SearchResult,
} from "../util/types";

interface EventContextType {
	monthViewData: MonthViewResponse | null;
	dayViewEvents: Event[];
	searchResults: SearchResult | null;

	categoryGroups: CategoryGroupWithCategories[];
	organizations: Category[];

	isLoadingMonth: boolean;
	isLoadingDay: boolean;
	isLoadingSearch: boolean;
	isLoadingMeta: boolean;
	error: string | null;

	fetchMonthEvents: (params: MonthViewParams) => Promise<void>;
	fetchDayEvents: (params: DayViewParams) => Promise<void>;
	searchEvents: (params: SearchParams) => Promise<void>;
	clearSearch: () => void;

	fetchEventById: (id: number) => Promise<EventDetail | null>;
	refreshMetadata: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [monthViewData, setMonthViewData] = useState<MonthViewResponse | null>(
		null,
	);
	const [dayViewEvents, setDayViewEvents] = useState<Event[]>([]);
	const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

	const [categoryGroups, setCategoryGroups] = useState<
		CategoryGroupWithCategories[]
	>([]);
	const [organizations, setOrganizations] = useState<Category[]>([]);

	const [isLoadingMonth, setIsLoadingMonth] = useState(false);
	const [isLoadingDay, setIsLoadingDay] = useState(false);
	const [isLoadingSearch, setIsLoadingSearch] = useState(false);
	const [isLoadingMeta, setIsLoadingMeta] = useState(false);

	const [error, setError] = useState<string | null>(null);

	// Fetch category & organizations (metadata)
	const refreshMetadata = useCallback(async () => {
		setIsLoadingMeta(true);
		try {
			const [groupsData, orgsData] = await Promise.all([
				getCategoryGroups(),
				getOrganizations(),
			]);
			setCategoryGroups(groupsData);
			setOrganizations(orgsData);
		} catch (err) {
			console.error("Failed to load metadata", err);
			setError("Failed to load categories.");
		} finally {
			setIsLoadingMeta(false);
		}
	}, []);

	// metadata initial load
	useEffect(() => {
		refreshMetadata();
	}, [refreshMetadata]);

	/* ACTIONS */
	const fetchMonthEvents = useCallback(async (params: MonthViewParams) => {
		setIsLoadingMonth(true);
		setError(null);
		try {
			const data = await getMonthEvents(params);
			setMonthViewData(data);
		} catch (err) {
			console.error(err);
			setError("failed fo fetch month events");
		} finally {
			setIsLoadingMonth(false);
		}
	}, []);

	const fetchDayEvents = useCallback(async (params: DayViewParams) => {
		setIsLoadingDay(true);
		setError(null);
		try {
			const data = await getDayEvents(params);
			setDayViewEvents(data);
		} catch (err) {
			console.error(err);
			setError("failed to fetch day events.");
		} finally {
			setIsLoadingDay(false);
		}
	}, []);

	const searchEvents = useCallback(async (params: SearchParams) => {
		setIsLoadingSearch(true);
		setError(null);
		try {
			const data = await getEventSearch(params);
			setSearchResults(data);
		} catch (err) {
			console.error(err);
			setError("failed to search events");
		} finally {
			setIsLoadingSearch(false);
		}
	}, []);

	const clearSearch = useCallback(() => {
		setSearchResults(null);
	}, []);

	const fetchEventById = useCallback(async (id: number) => {
		try {
			const data = await getEventDetail(id);
			return data;
		} catch (err) {
			console.error(err);
			setError("Failed to fetch event detail.");
			return null;
		}
	}, []);

	const value: EventContextType = {
		monthViewData,
		dayViewEvents,
		searchResults,
		categoryGroups,
		organizations,
		isLoadingMonth,
		isLoadingDay,
		isLoadingSearch,
		isLoadingMeta,
		error,
		fetchMonthEvents,
		fetchDayEvents,
		searchEvents,
		clearSearch,
		fetchEventById,
		refreshMetadata,
	};

	return (
		<EventContext.Provider value={value}>{children}</EventContext.Provider>
	);
};

export const useEvents = () => {
	const context = useContext(EventContext);
	if (context === undefined) {
		throw new Error("useEvents must be used within an EventProvider");
	}
	return context;
};
