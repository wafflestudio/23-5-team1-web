/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Item {
	/** @format int64 */
	categoryId: number;
	/**
	 * @format int32
	 * @min 1
	 */
	priority: number;
}

export interface ReplaceAllInterestCategoriesRequest {
	items: Item[];
}

export interface CreateTimetableRequest {
	/** @minLength 1 */
	name: string;
	/** @format int32 */
	year: number;
	semester: "SPRING" | "SUMMER" | "FALL" | "WINTER";
}

export interface TimetableResponse {
	/** @format int64 */
	id: number;
	name: string;
	/** @format int32 */
	year: number;
	semester: "SPRING" | "SUMMER" | "FALL" | "WINTER";
}

export interface CourseTimeSlotDto {
	dayOfWeek: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
	/**
	 * @format int32
	 * @min 0
	 * @max 1439
	 */
	startAt: number;
	/**
	 * @format int32
	 * @min 1
	 * @max 1440
	 */
	endAt: number;
}

export interface CreateCustomCourseRequest {
	/** @format int32 */
	year: number;
	semester: "SPRING" | "SUMMER" | "FALL" | "WINTER";
	/** @minLength 1 */
	courseTitle: string;
	/**
	 * @maxItems 2147483647
	 * @minItems 1
	 */
	timeSlots: CourseTimeSlotDto[];
	courseNumber?: string;
	lectureNumber?: string;
	/** @format int32 */
	credit?: number;
	instructor?: string;
}

export interface CourseDto {
	/** @format int64 */
	id: number;
	/** @format int32 */
	year: number;
	semester: "SPRING" | "SUMMER" | "FALL" | "WINTER";
	courseTitle: string;
	source: "CRAWLED" | "CUSTOM";
	timeSlots: CourseTimeSlotDto[];
	courseNumber?: string;
	lectureNumber?: string;
	/** @format int32 */
	credit?: number;
	instructor?: string;
}

export interface EnrollResponse {
	/** @format int64 */
	enrollId: number;
	course: CourseDto;
}

export interface CreateTagRequest {
	name: string;
}

export interface CreateTagResponse {
	/** @format int64 */
	id: number;
	name: string;
}

export interface User {
	/** @format int64 */
	id?: number;
	username?: string;
	email?: string;
	profileImageUrl?: string;
	/** @format date-time */
	createdAt?: string;
	/** @format date-time */
	updatedAt?: string;
}

export interface CreateMemoRequest {
	/** @format int64 */
	eventId: number;
	content: string;
	tagNames: string[];
}

export interface CreateMemoResponse {
	/** @format int64 */
	id: number;
	/** @format int64 */
	eventId: number;
	eventTitle: string;
	content: string;
	tags: string[];
	/** @format date-time */
	createdAt?: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
}

export interface RegisterResponse {
	accessToken: string;
	refreshToken: string;
}

export interface RefreshResponse {
	accessToken: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
}

export interface SyncResult {
	/** @format int32 */
	total: number;
	/** @format int32 */
	upserted: number;
	/** @format int32 */
	skipped: number;
}

export type JsonNode = any;

export interface UpdateTimetableRequest {
	/** @minLength 1 */
	name: string;
}

export interface UpdateTagRequest {
	name: string;
}

export interface UpdateTagResponse {
	/** @format int64 */
	id: number;
	name: string;
}

export interface UserDto {
	/** @format int64 */
	id: number;
	username?: string;
	email?: string;
	profileImageUrl?: string;
}

export interface CategoryDto {
	/** @format int64 */
	id: number;
	/** @format int64 */
	groupId: number;
	name: string;
	/** @format int32 */
	sortOrder: number;
}

export interface ListInterestCategoryResponse {
	items: Item[];
}

export interface ListTimetablesResponse {
	items: TimetableResponse[];
}

export interface ListEnrollsResponse {
	items: EnrollResponse[];
}

export interface ListTagResponse {
	tags: TagDto[];
}

export interface TagDto {
	/** @format int64 */
	id: number;
	name: string;
}

export interface ListMemoResponse {
	memos: CreateMemoResponse[];
}

export interface DetailEventResponse {
	/** @format int64 */
	id: number;
	title: string;
	imageUrl?: string;
	operationMode?: string;
	/** @format int64 */
	statusId?: number;
	/** @format int64 */
	eventTypeId?: number;
	/** @format int64 */
	orgId?: number;
	/** @format date-time */
	applyStart?: string;
	/** @format date-time */
	applyEnd?: string;
	/** @format date-time */
	eventStart?: string;
	/** @format date-time */
	eventEnd?: string;
	/** @format int32 */
	capacity?: number;
	/** @format int32 */
	applyCount: number;
	organization?: string;
	location?: string;
	applyLink?: string;
	tags?: string;
	isInterested?: boolean;
	/** @format int32 */
	matchedInterestPriority?: number;
	isBookmarked?: boolean;
	detail?: string;
}

export interface EventDto {
	/** @format int64 */
	id: number;
	title: string;
	imageUrl?: string;
	operationMode?: string;
	/** @format int64 */
	statusId?: number;
	/** @format int64 */
	eventTypeId?: number;
	/** @format int64 */
	orgId?: number;
	/** @format date-time */
	applyStart?: string;
	/** @format date-time */
	applyEnd?: string;
	/** @format date-time */
	eventStart?: string;
	/** @format date-time */
	eventEnd?: string;
	/** @format int32 */
	capacity?: number;
	/** @format int32 */
	applyCount: number;
	organization?: string;
	location?: string;
	applyLink?: string;
	tags?: string;
	mainContentHtml?: string;
	isInterested?: boolean;
	/** @format int32 */
	matchedInterestPriority?: number;
	isBookmarked?: boolean;
}

export interface TitleSearchEventResponse {
	/** @format int32 */
	page: number;
	/** @format int32 */
	size: number;
	/** @format int32 */
	total: number;
	items: EventDto[];
}

export interface DayBucket {
	/** @format int32 */
	total: number;
	preview: EventDto[];
}

export interface MonthEventResponse {
	range: Range;
	byDate: Record<string, DayBucket>;
}

export interface Range {
	/** @format date */
	from: string;
	/** @format date */
	to: string;
}

export interface DayEventResponse {
	/** @format int32 */
	page: number;
	/** @format int32 */
	size: number;
	/** @format int32 */
	total: number;
	/** @format date */
	date: string;
	items: EventDto[];
}

export interface CategoryGroupDto {
	/** @format int64 */
	id: number;
	name: string;
	/** @format int32 */
	sortOrder: number;
}

export interface CategoryResponse {
	group: CategoryGroupDto;
	categories: CategoryDto[];
}

export interface ListCategoryGroupWithCategoriesResponse {
	items: CategoryResponse[];
}

export interface ListOrgCategoriesResponse {
	items: CategoryDto[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
	/** set parameter to `true` for call `securityWorker` for this request */
	secure?: boolean;
	/** request path */
	path: string;
	/** content type of request body */
	type?: ContentType;
	/** query params */
	query?: QueryParamsType;
	/** format of response (i.e. response.json() -> format: "json") */
	format?: ResponseFormat;
	/** request body */
	body?: unknown;
	/** base url */
	baseUrl?: string;
	/** request cancellation token */
	cancelToken?: CancelToken;
}

export type RequestParams = Omit<
	FullRequestParams,
	"body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
	baseUrl?: string;
	baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
	securityWorker?: (
		securityData: SecurityDataType | null,
	) => Promise<RequestParams | undefined> | RequestParams | void;
	customFetch?: typeof fetch;
}

export interface HttpResponse<D, E = unknown> extends Response {
	data: D;
	error: E;
}

type CancelToken = symbol | string | number;

export enum ContentType {
	Json = "application/json",
	JsonApi = "application/vnd.api+json",
	FormData = "multipart/form-data",
	UrlEncoded = "application/x-www-form-urlencoded",
	Text = "text/plain",
}

class HttpClient<SecurityDataType = unknown> {
	public baseUrl: string = "/";
	private securityData: SecurityDataType | null = null;
	private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
	private abortControllers = new Map<CancelToken, AbortController>();
	private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
		fetch(...fetchParams);

	private baseApiParams: RequestParams = {
		credentials: "same-origin",
		headers: {},
		redirect: "follow",
		referrerPolicy: "no-referrer",
	};

	constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
		Object.assign(this, apiConfig);
	}

	public setSecurityData = (data: SecurityDataType | null) => {
		this.securityData = data;
	};

	protected encodeQueryParam(key: string, value: any) {
		const encodedKey = encodeURIComponent(key);
		return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
	}

	protected addQueryParam(query: QueryParamsType, key: string) {
		return this.encodeQueryParam(key, query[key]);
	}

	protected addArrayQueryParam(query: QueryParamsType, key: string) {
		const value = query[key];
		return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
	}

	protected toQueryString(rawQuery?: QueryParamsType): string {
		const query = rawQuery || {};
		const keys = Object.keys(query).filter(
			(key) => "undefined" !== typeof query[key],
		);
		return keys
			.map((key) =>
				Array.isArray(query[key])
					? this.addArrayQueryParam(query, key)
					: this.addQueryParam(query, key),
			)
			.join("&");
	}

	protected addQueryParams(rawQuery?: QueryParamsType): string {
		const queryString = this.toQueryString(rawQuery);
		return queryString ? `?${queryString}` : "";
	}

	private contentFormatters: Record<ContentType, (input: any) => any> = {
		[ContentType.Json]: (input: any) =>
			input !== null && (typeof input === "object" || typeof input === "string")
				? JSON.stringify(input)
				: input,
		[ContentType.JsonApi]: (input: any) =>
			input !== null && (typeof input === "object" || typeof input === "string")
				? JSON.stringify(input)
				: input,
		[ContentType.Text]: (input: any) =>
			input !== null && typeof input !== "string"
				? JSON.stringify(input)
				: input,
		[ContentType.FormData]: (input: any) => {
			if (input instanceof FormData) {
				return input;
			}

			return Object.keys(input || {}).reduce((formData, key) => {
				const property = input[key];
				formData.append(
					key,
					property instanceof Blob
						? property
						: typeof property === "object" && property !== null
							? JSON.stringify(property)
							: `${property}`,
				);
				return formData;
			}, new FormData());
		},
		[ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
	};

	protected mergeRequestParams(
		params1: RequestParams,
		params2?: RequestParams,
	): RequestParams {
		return {
			...this.baseApiParams,
			...params1,
			...(params2 || {}),
			headers: {
				...(this.baseApiParams.headers || {}),
				...(params1.headers || {}),
				...(params2?.headers || {}),
			},
		};
	}

	protected createAbortSignal = (
		cancelToken: CancelToken,
	): AbortSignal | undefined => {
		if (this.abortControllers.has(cancelToken)) {
			const abortController = this.abortControllers.get(cancelToken);
			if (abortController) {
				return abortController.signal;
			}
			return void 0;
		}

		const abortController = new AbortController();
		this.abortControllers.set(cancelToken, abortController);
		return abortController.signal;
	};

	public abortRequest = (cancelToken: CancelToken) => {
		const abortController = this.abortControllers.get(cancelToken);

		if (abortController) {
			abortController.abort();
			this.abortControllers.delete(cancelToken);
		}
	};

	public request = async <T = any, E = any>({
		body,
		secure,
		path,
		type,
		query,
		format,
		baseUrl,
		cancelToken,
		...params
	}: FullRequestParams): Promise<HttpResponse<T, E>> => {
		const secureParams =
			((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
				this.securityWorker &&
				(await this.securityWorker(this.securityData))) ||
			{};
		const requestParams = this.mergeRequestParams(params, secureParams);
		const queryString = query && this.toQueryString(query);
		const payloadFormatter = this.contentFormatters[type || ContentType.Json];
		const responseFormat = format || requestParams.format;

		return this.customFetch(
			`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
			{
				...requestParams,
				headers: {
					...(requestParams.headers || {}),
					...(type && type !== ContentType.FormData
						? { "Content-Type": type }
						: {}),
				},
				signal:
					(cancelToken
						? this.createAbortSignal(cancelToken)
						: requestParams.signal) || null,
				body:
					typeof body === "undefined" || body === null
						? null
						: payloadFormatter(body),
			},
		).then(async (response) => {
			const r = response as HttpResponse<T, E>;
			r.data = null as unknown as T;
			r.error = null as unknown as E;

			const responseToParse = responseFormat ? response.clone() : response;
			const data = !responseFormat
				? r
				: await responseToParse[responseFormat]()
						.then((data) => {
							if (r.ok) {
								r.data = data;
							} else {
								r.error = data;
							}
							return r;
						})
						.catch((e) => {
							r.error = e;
							return r;
						});

			if (cancelToken) {
				this.abortControllers.delete(cancelToken);
			}

			if (!response.ok) throw data;
			return data;
		});
	};
}

/**
 * @title Campus Event Calendar API
 * @version 1.0.0
 * @baseUrl /
 *
 * 학내 행사 캘린더 서비스 API 명세서
 */
class Api<SecurityDataType> extends HttpClient<SecurityDataType> {
	api = {
		/**
		 * No description
		 *
		 * @tags user-preference-controller
		 * @name ListInterestCategory
		 * @request GET:/api/v1/users/me/interest-categories
		 * @secure
		 */
		listInterestCategory: (params: RequestParams = {}) =>
			this.request<ListInterestCategoryResponse, any>({
				path: `/api/v1/users/me/interest-categories`,
				method: "GET",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags user-preference-controller
		 * @name ReplaceAllInterestCategories
		 * @request PUT:/api/v1/users/me/interest-categories
		 * @secure
		 */
		replaceAllInterestCategories: (
			data: ReplaceAllInterestCategoriesRequest,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/v1/users/me/interest-categories`,
				method: "PUT",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags timetable-controller
		 * @name ListTimetables
		 * @request GET:/api/v1/timetables
		 * @secure
		 */
		listTimetables: (
			query?: {
				/** @format int32 */
				year?: number;
				semester?: "SPRING" | "SUMMER" | "FALL" | "WINTER";
			},
			params: RequestParams = {},
		) =>
			this.request<ListTimetablesResponse, any>({
				path: `/api/v1/timetables`,
				method: "GET",
				query: query,
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags timetable-controller
		 * @name CreateTimetable
		 * @request POST:/api/v1/timetables
		 * @secure
		 */
		createTimetable: (
			data: CreateTimetableRequest,
			params: RequestParams = {},
		) =>
			this.request<TimetableResponse, any>({
				path: `/api/v1/timetables`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags enroll-controller
		 * @name CreateCustomCourseAndEnroll
		 * @request POST:/api/v1/timetables/{timetableId}/enrolls/custom
		 * @secure
		 */
		createCustomCourseAndEnroll: (
			timetableId: number,
			data: CreateCustomCourseRequest,
			params: RequestParams = {},
		) =>
			this.request<EnrollResponse, any>({
				path: `/api/v1/timetables/${timetableId}/enrolls/custom`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags tag-controller
		 * @name GetAllTags
		 * @request GET:/api/v1/tags
		 * @secure
		 */
		getAllTags: (params: RequestParams = {}) =>
			this.request<ListTagResponse, any>({
				path: `/api/v1/tags`,
				method: "GET",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags tag-controller
		 * @name CreateTag
		 * @request POST:/api/v1/tags
		 * @secure
		 */
		createTag: (data: CreateTagRequest, params: RequestParams = {}) =>
			this.request<CreateTagResponse, any>({
				path: `/api/v1/tags`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags memo-controller
		 * @name GetMyMemos
		 * @request GET:/api/v1/memos
		 * @secure
		 */
		getMyMemos: (
			query: {
				user: User;
			},
			params: RequestParams = {},
		) =>
			this.request<ListMemoResponse, any>({
				path: `/api/v1/memos`,
				method: "GET",
				query: query,
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags memo-controller
		 * @name CreateMemo
		 * @request POST:/api/v1/memos
		 * @secure
		 */
		createMemo: (
			query: {
				user: User;
			},
			data: CreateMemoRequest,
			params: RequestParams = {},
		) =>
			this.request<CreateMemoResponse, any>({
				path: `/api/v1/memos`,
				method: "POST",
				query: query,
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags auth-controller
		 * @name Register
		 * @request POST:/api/v1/auth/register
		 * @secure
		 */
		register: (data: RegisterRequest, params: RequestParams = {}) =>
			this.request<RegisterResponse, any>({
				path: `/api/v1/auth/register`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags auth-controller
		 * @name Refresh
		 * @request POST:/api/v1/auth/refresh
		 * @secure
		 */
		refresh: (params: RequestParams = {}) =>
			this.request<RefreshResponse, any>({
				path: `/api/v1/auth/refresh`,
				method: "POST",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags auth-controller
		 * @name Login
		 * @request POST:/api/v1/auth/login
		 * @secure
		 */
		login: (data: LoginRequest, params: RequestParams = {}) =>
			this.request<LoginResponse, any>({
				path: `/api/v1/auth/login`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags user-controller
		 * @name GetMe
		 * @request GET:/api/v1/users/me
		 * @secure
		 */
		getMe: (params: RequestParams = {}) =>
			this.request<UserDto, any>({
				path: `/api/v1/users/me`,
				method: "GET",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags user-controller
		 * @name UpdateProfile
		 * @request PATCH:/api/v1/users/me
		 * @secure
		 */
		updateProfile: (data: JsonNode, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/v1/users/me`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags timetable-controller
		 * @name DeleteTimetable
		 * @request DELETE:/api/v1/timetables/{timetableId}
		 * @secure
		 */
		deleteTimetable: (timetableId: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/v1/timetables/${timetableId}`,
				method: "DELETE",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags timetable-controller
		 * @name UpdateTimetable
		 * @request PATCH:/api/v1/timetables/{timetableId}
		 * @secure
		 */
		updateTimetable: (
			timetableId: number,
			data: UpdateTimetableRequest,
			params: RequestParams = {},
		) =>
			this.request<TimetableResponse, any>({
				path: `/api/v1/timetables/${timetableId}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags enroll-controller
		 * @name GetEnroll
		 * @request GET:/api/v1/timetables/{timetableId}/enrolls/{enrollId}
		 * @secure
		 */
		getEnroll: (
			timetableId: number,
			enrollId: number,
			params: RequestParams = {},
		) =>
			this.request<EnrollResponse, any>({
				path: `/api/v1/timetables/${timetableId}/enrolls/${enrollId}`,
				method: "GET",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags enroll-controller
		 * @name DeleteEnroll
		 * @request DELETE:/api/v1/timetables/{timetableId}/enrolls/{enrollId}
		 * @secure
		 */
		deleteEnroll: (
			timetableId: number,
			enrollId: number,
			params: RequestParams = {},
		) =>
			this.request<void, any>({
				path: `/api/v1/timetables/${timetableId}/enrolls/${enrollId}`,
				method: "DELETE",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags enroll-controller
		 * @name UpdateCustomEnroll
		 * @request PATCH:/api/v1/timetables/{timetableId}/enrolls/{enrollId}
		 * @secure
		 */
		updateCustomEnroll: (
			timetableId: number,
			enrollId: number,
			data: JsonNode,
			params: RequestParams = {},
		) =>
			this.request<EnrollResponse, any>({
				path: `/api/v1/timetables/${timetableId}/enrolls/${enrollId}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags tag-controller
		 * @name DeleteTag
		 * @request DELETE:/api/v1/tags/{tagId}
		 * @secure
		 */
		deleteTag: (tagId: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/v1/tags/${tagId}`,
				method: "DELETE",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags tag-controller
		 * @name UpdateTag
		 * @request PATCH:/api/v1/tags/{tagId}
		 * @secure
		 */
		updateTag: (
			tagId: number,
			data: UpdateTagRequest,
			params: RequestParams = {},
		) =>
			this.request<UpdateTagResponse, any>({
				path: `/api/v1/tags/${tagId}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags enroll-controller
		 * @name ListEnrolls
		 * @request GET:/api/v1/timetables/{timetableId}/enrolls
		 * @secure
		 */
		listEnrolls: (timetableId: number, params: RequestParams = {}) =>
			this.request<ListEnrollsResponse, any>({
				path: `/api/v1/timetables/${timetableId}/enrolls`,
				method: "GET",
				secure: true,
				...params,
			}),

		/**
		 * @description 서비스 상태 확인(인증 불필요)
		 *
		 * @tags System
		 * @name Health
		 * @summary Health check
		 * @request GET:/api/v1/health
		 * @secure
		 */
		health: (params: RequestParams = {}) =>
			this.request<Record<string, string>, any>({
				path: `/api/v1/health`,
				method: "GET",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags event-controller
		 * @name Detail
		 * @request GET:/api/v1/events/{eventId}
		 * @secure
		 */
		detail: (eventId: number, params: RequestParams = {}) =>
			this.request<DetailEventResponse, any>({
				path: `/api/v1/events/${eventId}`,
				method: "GET",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags event-controller
		 * @name SearchTitle
		 * @request GET:/api/v1/events/search/title
		 * @secure
		 */
		searchTitle: (
			query: {
				query: string;
				/**
				 * @format int32
				 * @default 1
				 */
				page?: number;
				/**
				 * @format int32
				 * @default 20
				 */
				size?: number;
			},
			params: RequestParams = {},
		) =>
			this.request<TitleSearchEventResponse, any>({
				path: `/api/v1/events/search/title`,
				method: "GET",
				query: query,
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags event-controller
		 * @name Month
		 * @request GET:/api/v1/events/month
		 * @secure
		 */
		month: (
			query: {
				/** @format date */
				from: string;
				/** @format date */
				to: string;
				statusId?: number[];
				eventTypeId?: number[];
				orgId?: number[];
			},
			params: RequestParams = {},
		) =>
			this.request<MonthEventResponse, any>({
				path: `/api/v1/events/month`,
				method: "GET",
				query: query,
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags event-controller
		 * @name Day
		 * @request GET:/api/v1/events/day
		 * @secure
		 */
		day: (
			query: {
				/** @format date */
				date: string;
				/**
				 * @format int32
				 * @default 1
				 */
				page?: number;
				/**
				 * @format int32
				 * @default 20
				 */
				size?: number;
				statusId?: number[];
				eventTypeId?: number[];
				orgId?: number[];
			},
			params: RequestParams = {},
		) =>
			this.request<DayEventResponse, any>({
				path: `/api/v1/events/day`,
				method: "GET",
				query: query,
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Categories
		 * @name GetCategoryGroupsWithCategories
		 * @summary 카테고리 그룹 + 카테고리 목록
		 * @request GET:/api/v1/category-groups/with-categories
		 * @secure
		 */
		getCategoryGroupsWithCategories: (params: RequestParams = {}) =>
			this.request<ListCategoryGroupWithCategoriesResponse, any>({
				path: `/api/v1/category-groups/with-categories`,
				method: "GET",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags Categories
		 * @name GetOrgCategories
		 * @summary 주체기관 카테고리 목록 조회
		 * @request GET:/api/v1/categories/orgs
		 * @secure
		 */
		getOrgCategories: (params: RequestParams = {}) =>
			this.request<ListOrgCategoriesResponse, any>({
				path: `/api/v1/categories/orgs`,
				method: "GET",
				secure: true,
				...params,
			}),

		/**
		 * No description
		 *
		 * @tags user-preference-controller
		 * @name DeleteInterestCategory
		 * @request DELETE:/api/v1/users/me/interest-categories/{categoryId}
		 * @secure
		 */
		deleteInterestCategory: (categoryId: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/api/v1/users/me/interest-categories/${categoryId}`,
				method: "DELETE",
				secure: true,
				...params,
			}),
	};
	admin = {
		/**
		 * No description
		 *
		 * @tags event-sync-controller
		 * @name Sync
		 * @request POST:/admin/events/sync
		 * @secure
		 */
		sync: (params: RequestParams = {}) =>
			this.request<SyncResult, any>({
				path: `/admin/events/sync`,
				method: "POST",
				secure: true,
				...params,
			}),
	};
}
