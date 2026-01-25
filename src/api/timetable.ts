import type { 
	Semester, 
	Timetable, 
	PatchTimetableRequest, 
	CreateTimetableRequest,
	GetCoursesResponse,
	CreateCustomCourseRequest
} from "../util/types";
import api from "./axios";


export const deleteTimetable = async (timetableId: number) => {
	await api.delete(`/timetables/${timetableId}`);
};

export const getTimetable = async (year: number, semester: Semester) => {
	const res = await api.get<{items: Timetable[]}>("/timetables", {
		params: { year, semester },
	});

	return res.data.items;
};

export const patchTimetableName = async (
	timetableId: number,
	body: PatchTimetableRequest,
): Promise<Timetable>  => {
	const res = await api.patch<Timetable>(`/timetables/${timetableId}`, body);
	return res.data;
};

export const addTimetable = async (
	body: CreateTimetableRequest,
): Promise<Timetable> => {
	const res = await api.post<Timetable>(`/timetables`, body);
	return res.data;
}

export const deleteCourse = async (timetableId: number, enrollId: number) => {
	await api.delete(`/timetables/${timetableId}/enrolls/${enrollId}`);
};

export const getTimetableCourse = async (timetableId: number, enrollId: number) => {
	const res = await api.get<GetCoursesResponse>(`/timetables/${timetableId}/enrolls/${enrollId}`);
	return res.data;
}

export const getTimetableCourses = async (timetableId: number) => {
	const res = await api.get<{items: GetCoursesResponse[]}>(`/timetables/${timetableId}/enrolls`);
	return res.data.items;
}

export const updateCustomCourse = async (timetableId: number, enrollId: number, body: string): Promise<GetCoursesResponse> => {
	const res = await api.patch<GetCoursesResponse>(`/timetables/${timetableId}/enrolls/${enrollId}`, body);
	return res.data;
}

export const addCustomCourse = async (timetableId: number, body: CreateCustomCourseRequest): Promise<GetCoursesResponse> => {
	const res = await api.post<GetCoursesResponse>(`/timetables/${timetableId}/enrolls/custom`, body);
	return res.data;
}