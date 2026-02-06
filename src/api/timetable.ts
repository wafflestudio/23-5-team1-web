import api from "./axios";
import axios from "axios";

import type {
	Semester,
	Timetable,
	PatchTimetableRequest,
	CreateTimetableRequest,
	GetCoursesResponse,
	CreateCustomCourseRequest,
	ApiErrorResponse,
	Course,
	TimeSlot,
} from "../util/types";

/** ---------- Mapper (DTO <-> Domain) ---------- */

interface CourseDto {
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

interface CourseTimeSlotDto {
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

interface CreateTimetableRequestDto {
	/** @minLength 1 */
	name: string;
	/** @format int32 */
	year: number;
	semester: "SPRING" | "SUMMER" | "FALL" | "WINTER";
}

interface UpdateTimetableRequestDto {
	/** @minLength 1 */
	name: string;
}

interface TimetableResponse {
	/** @format int64 */
	id: number;
	name: string;
	/** @format int32 */
	year: number;
	semester: "SPRING" | "SUMMER" | "FALL" | "WINTER";
}

interface ListTimetablesResponse {
	items: TimetableResponse[];
}

interface EnrollResponse {
	/** @format int64 */
	enrollId: number;
	course: CourseDto;
}

interface ListEnrollsResponse {
	items: EnrollResponse[];
}

interface CourseDto {
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

interface CourseTimeSlotDto {
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

interface CreateCustomCourseRequestDto {
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

type JsonNode = any;

// Timetable
const toTimetable = (dto: TimetableResponse): Timetable => ({
	id: dto.id,
	name: dto.name,
	year: dto.year,
	semester: dto.semester as Semester,
});

// TimeSlot (⚠️ dayOfweek <-> dayOfWeek)
const toTimeSlot = (dto: CourseTimeSlotDto): TimeSlot => ({
	dayOfweek: dto.dayOfWeek, // DTO -> Domain
	startAt: dto.startAt,
	endAt: dto.endAt,
});

const toTimeSlotDto = (slot: TimeSlot): CourseTimeSlotDto => ({
	dayOfWeek: slot.dayOfweek, // Domain -> DTO
	startAt: slot.startAt,
	endAt: slot.endAt,
});

// Course
const toCourse = (dto: CourseDto): Course => ({
	id: dto.id,
	year: dto.year,
	semester: dto.semester as Semester,
	courseTitle: dto.courseTitle,
	source: dto.source, // Domain은 string이라 그대로 들어감
	timeSlots: dto.timeSlots.map(toTimeSlot),
	courseNumber: dto.courseNumber,
	lectureNumber: dto.lectureNumber,
	credit: dto.credit,
	instructor: dto.instructor,
});

// Enroll/GetCoursesResponse
const toGetCoursesResponse = (dto: EnrollResponse): GetCoursesResponse => ({
	enrollId: dto.enrollId,
	course: toCourse(dto.course),
});

// Requests (Domain -> DTO)
const toCreateTimetableRequestDto = (
	body: CreateTimetableRequest,
): CreateTimetableRequestDto => ({
	name: body.name,
	year: body.year,
	semester: body.semester,
});

const toUpdateTimetableRequestDto = (
	body: PatchTimetableRequest,
): UpdateTimetableRequestDto => ({
	name: body.name,
});

const toCreateCustomCourseRequestDto = (
	body: CreateCustomCourseRequest,
): CreateCustomCourseRequestDto => ({
	year: body.year,
	semester: body.semester,
	courseTitle: body.courseTitle,
	timeSlots: body.timeSlots.map(toTimeSlotDto),
	courseNumber: body.courseNumber,
	lectureNumber: body.lectureNumber,
	credit: body.credit,
	instructor: body.instructor,
});

/** ---------- API functions (Domain return types) ---------- */

export const deleteTimetable = async (timetableId: number): Promise<void> => {
	try {
		await api.delete(`/timetables/${timetableId}`);
	} catch (err) {
		if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
			const { status, data } = err.response;
			throw {
				status,
				code: data?.code,
				message: data?.message ?? "시간표 삭제에 실패했습니다.",
			};
		}
		throw err;
	}
};

export const getTimetable = async (
	year: number,
	semester: Semester,
): Promise<Timetable[]> => {
	const res = await api.get<ListTimetablesResponse>("/timetables", {
		params: { year, semester },
	});

	return res.data.items.map(toTimetable);
};

export const patchTimetableName = async (
	timetableId: number,
	body: PatchTimetableRequest,
): Promise<Timetable> => {
	const dtoBody = toUpdateTimetableRequestDto(body);
	const res = await api.patch<TimetableResponse>(
		`/timetables/${timetableId}`,
		dtoBody,
	);
	return toTimetable(res.data);
};

export const addTimetable = async (
	body: CreateTimetableRequest,
): Promise<Timetable> => {
	const dtoBody = toCreateTimetableRequestDto(body);
	const res = await api.post<TimetableResponse>("/timetables", dtoBody);
	return toTimetable(res.data);
};

export const deleteCourse = async (
	timetableId: number,
	enrollId: number,
): Promise<void> => {
	await api.delete(`/timetables/${timetableId}/enrolls/${enrollId}`);
};

/*
export const getTimetableCourse = async (
	timetableId: number,
	enrollId: number,
): Promise<GetCoursesResponse> => {
	const res = await api.get<EnrollResponse>(
		`/timetables/${timetableId}/enrolls/${enrollId}`,
	);
	return toGetCoursesResponse(res.data);
};
*/
export const getTimetableCourses = async (
	timetableId: number,
): Promise<GetCoursesResponse[]> => {
	const res = await api.get<ListEnrollsResponse>(
		`/timetables/${timetableId}/enrolls`,
	);
	return res.data.items.map(toGetCoursesResponse);
};

/**
 * PATCH enroll (커스텀 수업 수정)
 * swagger가 JsonNode로 열려있어서 body는 unknown으로 받고 그대로 보냄.
 * (현재 프로젝트에서 string/object 무엇을 보내는지에 따라 호출부는 그대로 유지 가능)
 */
export const updateCustomCourse = async (
	timetableId: number,
	enrollId: number,
	body: unknown,
): Promise<GetCoursesResponse> => {
	const res = await api.patch<EnrollResponse>(
		`/timetables/${timetableId}/enrolls/${enrollId}`,
		body as JsonNode,
	);
	return toGetCoursesResponse(res.data);
};

export const addCustomCourse = async (
	timetableId: number,
	body: CreateCustomCourseRequest,
): Promise<GetCoursesResponse> => {
	const dtoBody = toCreateCustomCourseRequestDto(body);
	const res = await api.post<EnrollResponse>(
		`/timetables/${timetableId}/enrolls/custom`,
		dtoBody,
	);
	return toGetCoursesResponse(res.data);
};
