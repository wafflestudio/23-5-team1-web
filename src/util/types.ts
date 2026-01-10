interface Category {
	name: string;
	sort_order: number;
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

export interface Memo {
	content: string;
	tag: string[];
}

type Semester = "SPRING" | "SUMMER" | "FALL" | "WINTER";

interface Course {
	year: number;
	semester: Semester;
	course_number: string;
	lecture_number: string;
	course_title: string;
	start_at: number;
	end_at: number;
	credit: number;
	instructor: string;
}

interface Timetable {
	name: string;
	year: number;
	semester: Semester;
	courses: Course[];
}
