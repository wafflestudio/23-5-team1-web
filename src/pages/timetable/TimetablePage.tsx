// 시간 정보 -> UTC 시간으로 변환. Date 객체 활용

import { useMemo, useState } from "react";
import type { Course, TimeSlot } from "../../util/types";
import { AddClassPanel } from "./AddClassPanel";
import { type GridConfig, hasOverlap } from "./layout";
import { WeekGrid } from "./WeekGrid";
import "./timetable.css";
import { Sidebar } from "../../util/Sidebar";
import { SlArrowLeft } from "react-icons/sl";
// import Toolbar from "../widgets/Toolbar";

export default function TimetablePage() {
	const [course, setCourse] = useState<Course[]>([]);

	const config: GridConfig = useMemo(
		() => ({
			startHour: 8,
			endHour: 25,
			ppm: 0.9,
		}),
		[],
	);

	const allSlots: TimeSlot[] = useMemo(
		() => course.flatMap((c) => c.slot),
		[course],
	);

	const addCourse = (item: Course) => {
		item.slot.forEach((time) => {
			if (hasOverlap(allSlots, time)) {
				alert("겹치는 수업은 추가할 수 없습니다. ");
				return;
			}
			setCourse((prev) => [...prev, item]);
		});
	};

	const [isClicked, setIsClicked] = useState(false);

	// 시간 설정 관련 논의 필요
	const now = new Date();

	return (
		<div className={`tt-page ${isClicked ? "tt-page--open" : "tt-page--closed"}`}>
			< Sidebar/>

			<main>
				<div className="tt-title">
					<h1>
						{now.getFullYear()}년 {now.getMonth() + 1}월 {now.getDate()}일
					</h1>
					{/* < Toolbar/> */}
				</div>

				<div>
					<WeekGrid courses={course} config={config} />
				</div>
			</main>
			{ !isClicked &&  <button type="button" className="tt-addButton" onClick={() => setIsClicked(true)}>  <SlArrowLeft /> 수업 추가</button>}
			{ isClicked && <AddClassPanel onAdd={addCourse} existingSlots={allSlots} /> }
		</div>
	);
}
