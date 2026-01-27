import { useEffect, useState, useMemo } from "react";
import { useTimetable } from "../../contexts/TimetableContext";
import type { Semester } from "../../util/types";
import { AddClassPanel } from "./AddClassPanel";
import {
	flattenCoursesToBlocks,
	config,
} from "../../util/weekly_timetable/layout";
import { TimetableGrid } from "../components/TimetableGrid";
import "./timetable.css";
import { SlArrowLeft } from "react-icons/sl";
import { TimeTableSidebar } from "./TimeTableSidebar";
import TimeTableToolbar from "./TimeTableToolbar";

export default function TimetablePage() {
	const now = new Date();
	const years = Array.from({ length: 10 }, (_, i) => now.getFullYear() - i);
	const semesters: { id: Semester; label: string }[] = [
		{ id: "SPRING", label: "1학기" },
		{ id: "SUMMER", label: "여름 학기" },
		{ id: "FALL", label: "2학기" },
		{ id: "WINTER", label: "겨울 계절" },
	];

	const {
		timetables,
		courses,
		currentTimetable,
		createTimetable,
		isLoading,
		loadTimetable,
		selectTimetable,
		updateTimetableName,
		deleteTimetable,
		loadCourses,
		addCustomCourse,
		//updateCustomCourse,
		deleteCourse,
	} = useTimetable();

	const [year, setYear] = useState<number>(now.getFullYear());
	const [semester, setSemester] = useState<Semester>("SPRING");
	const [tableName, setTableName] = useState<string>("");

	useEffect(() => {
		loadTimetable(year, semester);
	}, [year, semester, loadTimetable]);

	useEffect(() => {
		if (!currentTimetable) return;
		loadCourses(currentTimetable.id);
	}, [currentTimetable, loadCourses]);

	useEffect(() => {
		if (!currentTimetable) {
			console.log("시간표 없음");
			setIsClicked(false);
			setTableName("");
			return;
		}
		setTableName(currentTimetable?.name ?? "");
	}, [currentTimetable]);

	const hasTimetable = !!currentTimetable;

	const visibleCourses = hasTimetable ? (courses ?? []) : [];

	const allSlots = useMemo(
		() => visibleCourses.flatMap((c) => c.course.timeSlots),
		[visibleCourses],
	);

	const [isClicked, setIsClicked] = useState(false);

	if (isLoading) return <div>로딩 중...</div>;

	return (
		<div
			className={`tt-page ${isClicked ? "tt-page--open" : "tt-page--closed"}`}
		>
			<TimeTableSidebar
				timetables={timetables}
				onAddTimetable={() =>
					createTimetable({
						year,
						semester,
						name: "새 시간표",
					})
				}
				onSelectTimetable={selectTimetable}
				onRename={updateTimetableName}
				onDelete={deleteTimetable}
			/>

			<main>
				<TimeTableToolbar
					timetableName={tableName}
					year={year}
					semester={semester}
					SEMESTER_LABEL={semesters}
					onSemesterChange={setSemester}
					onYearChange={setYear}
					years={years}
				/>
				{!hasTimetable ? (
					<div style={{ padding: 16 }}>
						<div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
							선택된 시간표가 없어요
						</div>
						<div style={{ opacity: 0.7, lineHeight: 1.5 }}>
							왼쪽 사이드바에서 시간표를 추가하거나 선택해 주세요.
						</div>
					</div>
				) : (
					<div>
						<TimetableGrid
							timetableId={currentTimetable?.id ?? 0}
							items={courses ?? []}
							config={config}
							toBlocks={flattenCoursesToBlocks}
							onRemoveBlock={deleteCourse}
						/>
					</div>
				)}
			</main>
			{hasTimetable && !isClicked && (
				<button
					type="button"
					className="tt-addButton"
					onClick={() => setIsClicked(true)}
				>
					{" "}
					<SlArrowLeft /> 수업 추가
				</button>
			)}
			{hasTimetable && isClicked && (
				<AddClassPanel
					timetableId={currentTimetable?.id}
					onAdd={addCustomCourse}
					allSlots={allSlots}
					year={year}
					semester={semester}
					setIsClicked={setIsClicked}
				/>
			)}
		</div>
	);
}
