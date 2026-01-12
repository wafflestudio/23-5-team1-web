export interface AuthTokens {
	accessToken: string;
	refreshToken: string | null;
}

export interface Category {
	id: number;
	groupId: number;
	name: string;
	sort_order: number;
}

export interface CategoryGroup {
	id: number;
	name: string;
	sortOrder: number;
}

export interface CategoryGroupWithCategories {
	group: CategoryGroup;
	categories: Category[];
}

export interface User {
	username: string;
	email: string;
	profile_image_url: string;

	// excluded_keywords: string[];
	// interest_categories: Category[];
	// bookmarks: string[]; // list of event id's
	// memos: Memo[];
}

export interface Event {
	id: number;
	title: string;
	image_url: string;
	operation_mode: string; //온라인 오프라인 온오프라인 병행
	status_id: number;
	event_type_id: number;
	org_id: number;
	apply_start: Date;
	apply_end: Date;

	organization: string;
	apply_link: string;

	// following properties are only on BlockEvents
	event_start: Date;
	event_end: Date;
	capacity: number;
	location: string;
}

export interface Memo {
	content: string;
	tag: string[];
}

type Semester = "SPRING" | "SUMMER" | "FALL" | "WINTER";

interface Course {
	year: number;
	semester: Semester;
	courseNumber: string;
	lectureNumber: string;
	courseTitle: string;
	startAt: number;
	endAt: number;
	credit: number;
	instructor: string;
}

interface Timetable {
	name: string;
	year: number;
	semester: Semester;
	courses: Course[];
}

export interface MonthViewDayBucket {
	total: number;
	preview: Event[];
}

export interface MonthViewResponse {
	range: {
		from: string; // YYYY-MM-DD (Start of the view)
		to: string; // YYYY-MM-DD (End of the view)
	};

	byDate: Record<string, MonthViewDayBucket>;
}

export interface MonthViewParams {
	from: string; // YYYY-MM-DD
	to: string;
	statusId?: number;
	eventTypeId?: number;
	orgId?: number;
	q?: string;
}
