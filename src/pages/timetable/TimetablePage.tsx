import { useMemo, useState } from "react";
import type { Course, Semester } from "../../util/types";
import { AddClassPanel } from "./AddClassPanel";
import { type GridConfig, hasOverlap } from "./layout";
import { WeekGrid } from "./WeekGrid";
import "./timetable.css";
import { Sidebar } from "../../util/Sidebar";
import { SlArrowLeft } from "react-icons/sl";
// import Toolbar from "../widgets/Toolbar";

type TTKey = `${number}-${Semester}`;
type Tables = Partial<Record<TTKey, Course[]>>;

export default function TimetablePage() {

	const now = new Date();
	const years =  Array.from({ length: 10 }, (_, i) => now.getFullYear() - i);
	const semesters : {id: Semester, label: string}[] = [{id : "SPRING", label: "1학기"}, {id:"SUMMER", label: "여름 학기"}, {id: "FALL", label: "2학기"}, {id: "WINTER", label: "겨울 계절"}];

	const [year, setYear] = useState<number>(now.getFullYear());
	const [semester, setSemester] = useState<Semester>("SPRING");
	const [tables, setTables] = useState<Tables>({});

	const config: GridConfig = useMemo(
		() => ({
			startHour: 0,
			endHour: 24,
			ppm: 0.9,
		}),
		[],
	);

	// 추후 백엔드 연결 필요
	const key = `${year}-${semester}` as TTKey;
	const courses = tables[key] ?? [];
	const allSlots = courses.flatMap((c) => c.slot)

	const addCourse = (item: Course) => {
		if (item.slot.some((t) => hasOverlap(allSlots, t))) {
			alert("겹치는 수업은 추가할 수 없습니다.");
			return;
		}

		setTables((prev) => ({
			...prev,
			[key]: [...(prev[key] ?? []), item],
		}));
		};

	const removeCourse = (courseId: number) => {
		setTables((prev) => ({
			...prev,
			[key]: (prev[key] ?? []).filter(
				(course) => course.id !== courseId
			),
		}));
	};

	const [isClicked, setIsClicked] = useState(false);

	return (
		<div className={`tt-page ${isClicked ? "tt-page--open" : "tt-page--closed"}`}>
			< Sidebar/>

			<main>
				<div className="tt-title">
					<h1>
						{now.getFullYear()}년 {now.getMonth() + 1}월 {now.getDate()}일
					</h1>
					<select value={year} onChange={(e) => setYear(Number(e.target.value))}>
						{years.map((y) => (
							<option key={y} value={y}>
								{y}
							</option>
						))}
					</select>
					<select value={semester} onChange={(e) => setSemester(e.target.value as Semester)}>
						{semesters.map((s) => (
							<option key={s.id} value={s.id}>
								{s.label}
							</option>
						))}
					</select>
					{/* < Toolbar/> */}
				</div>

				<div>
					<WeekGrid courses={courses} config={config} removeCourse={removeCourse}/>
				</div>
			</main>
			{ !isClicked &&  <button type="button" className="tt-addButton" onClick={() => setIsClicked(true)}>  <SlArrowLeft /> 수업 추가</button>}
			{ isClicked && <AddClassPanel onAdd={addCourse} year={year} semester={semester} setIsClicked={setIsClicked}/> }
		</div>
	);
}
