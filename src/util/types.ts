export interface AuthTokens {
	accessToken: string;
	refreshToken: string | null;
}

export interface User {
	username: string;
	email: string;
	profileImageUrl: string;

	// excluded_keywords: string[];
	// interest_categories: Category[];
	// bookmarks: string[]; // list of event id's
	// memos: Memo[];
}

export interface EventBase {
	id: number;
	title: string;
	imageUrl: string;

	operationMode: string; // 온라인 오프라인 온오프라인 병행

	statusId: number; // 1 : 모집중, 2 : 마감 임박, 3 : 마감
	eventTypeId: number; // 1: 교육(특강/세미나) 2:공모전/경진대회 3:현장학습/인턴 4:사회공헌/봉사 5:학습/진로상담 6:레크리에이션 999:기타
	orgId: number; // 주체기관 id - FE에서는 사용 X
	organization: string; // 주체기관 id

	tags: string[]; // TODO: 백엔드 측에게 필요하다고 연락

	applyLink: string; // 지원 url

	// following properties are only on BlockEvents
	capacity: number;
	location: string;

	applyCount: number;
	isInterested: boolean;
	matchedInterestPriority: number;
	isBookmarked: boolean; // 백엔드 요청 부분
}

export interface EventDTO extends EventBase {
	applyStart: string; //  지원 시작 날짜
	applyEnd: string; // 지원 마감 날짜
	eventStart: string; // 활동 시작 날짜일시
	eventEnd: string; // 활동 끝 날짜일시
}

export interface Event extends EventBase {
	applyStart: Date; //  지원 시작 날짜
	applyEnd: Date; // 지원 마감 날짜
	eventStart: Date; // 활동 시작 날짜일시
	eventEnd: Date; // 활동 끝 날짜일시
}

export interface EventDetailExtras {
	bookmarkCount: number;
	detail: string;
}

export interface EventDetailDTO extends EventDTO, EventDetailExtras {}
export interface EventDetail extends Event, EventDetailExtras {}

export interface Category {
	id: number;
	groupId: number; // 1: 모집현황, 2: 주체기관, 3: 프로그램 유형
	name: string;
	sortOrder: number;
}

export interface CategoryGroup {
	id: number;
	name: string; // 모집현황 | 주체기관 | 프로그램 유형
	sortOrder: number; // 각각 1, 2, 3
}

export interface CategoryGroupWithCategories {
	group: CategoryGroup; // 대분류 이름, 우선순위, 아이디 등
	categories: Category[]; // 실제 분류에 속하는 카테고리
}

export interface InterestCategories {
	id: number;
	categoryId: number;
	sortOrder: number;
}

export interface Memo {
	id: number;
	eventId: number;
	content: string;
	tags: string[];
}

type Semester = "SPRING" | "SUMMER" | "FALL" | "WINTER";

export interface Course {
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

export interface Timetable {
	name: string;
	year: number;
	semester: Semester;
	courses: Course[];
}

export interface EventFilters {
	from: string;
	to: string;
	statusId?: number;
	eventTypeId?: number;
	orgId?: number;
}

export interface MonthViewBucket {
	total: number;
	preview: Event[];
}

export interface MonthViewResponseDTO {
	range: {
		from: string; // YYYY-MM-DD (Start of the view)
		to: string; // YYYY-MM-DD (End of the view)
	};

	byDate: Record<string, { total: number; preview: EventDTO[] }>;
}

export interface MonthViewResponse {
	range: {
		from: Date;
		to: Date;
	};

	byDate: Record<string, MonthViewBucket>;
}

export interface MonthViewParams {
	from: string; // YYYY-MM-DD
	to: string;
	// 아래 : 필터링
	statusId?: number; // 모집 상태
	eventTypeId?: number; // 카테고리
	orgId?: number; // 주체 기관
}

export interface DayViewParams {
	date: string;
	page?: number;
	size?: number;
	statusId?: number;
	eventTypeId?: number;
	orgId?: number;
}

export interface DayViewResponse {
	date: string; // yyyy-mm-dd
	items: EventDTO[];
}

export interface SearchParams {
	query: string;
	page?: number;
	size?: number;
}
export interface SearchResultDTO {
	page: number;
	size: number;
	total: number;
	items: EventDTO[];
}
export interface SearchResult {
	page: number;
	size: number;
	total: number;
	items: Event[];
}
