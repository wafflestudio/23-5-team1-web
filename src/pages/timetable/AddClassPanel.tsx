import { useMemo, useRef, useState } from "react";
import { SlArrowRight } from "react-icons/sl";
import { TiDelete } from "react-icons/ti";
import { hasOverlap } from "../../util/weekly_timetable/layout";

import type {
	Course,
	CreateCustomCourseRequest,
	Day,
	Semester,
	SlotRow,
	TimeSlot,
} from "../../util/types";
import { DAY_LABELS_KO } from "../../util/types";
import { buildTimeOptions, STEP_MIN } from "../../util/weekly_timetable/time";
import "./timetable.css";

type Props = {
	onAdd: (timetableId: number, body: CreateCustomCourseRequest) => void;
	allSlots: TimeSlot[];
	year: number;
	semester: Semester;
	setIsClicked: (isClicked: boolean) => void;
};

const DAYS: Day[] = [0, 1, 2, 3, 4, 5, 6];

export function AddClassPanel({ onAdd, allSlots, year, semester, setIsClicked }: Props) {
	const timeOptions = useMemo(() => buildTimeOptions(STEP_MIN), []);
	const [title, setTitle] = useState("");
	const [professor, setProfessor] = useState("");
	const [credit, setCredit] = useState<number | undefined>(undefined); 

	const emptyRow = (): SlotRow => ({
		rowId: crypto.randomUUID(),
		day: 0,
		startMin: 8 * 60,
		endMin: 11 * 60,
	});

	const [slot, setSlot] = useState<SlotRow[]>([emptyRow()]);
	const addRow = () => setSlot((prev) => [...prev, emptyRow()]);
	const removeRow = (rowId: string) =>
		setSlot((prev) => prev.filter((t) => t.rowId !== rowId));
	const updateRow = (rowId: string, patch: Partial<SlotRow>) =>
		setSlot((prev) =>
			prev.map((r) => (r.rowId === rowId ? ({ ...r, ...patch } as SlotRow): r)),
		);

	const nextIdRef = useRef(0);

	const isTimeRangeValid = useMemo(() => {
	return slot.every((t) =>
		t.endMin > t.startMin &&
		t.startMin % STEP_MIN === 0 &&
		t.endMin % STEP_MIN === 0
	);
	}, [slot]);

	const isTitleValid = useMemo(() => {
		return title.trim().length > 0;
	}, [title])

	const hasConflict = useMemo(() => {
	if (!isTimeRangeValid) return false; // 시간 자체가 말이 안 되면 겹침 검사 의미 없음
	return slot.some((s) => hasOverlap(allSlots, s));
	}, [slot, allSlots, isTimeRangeValid]);

	const canSave = isTimeRangeValid && isTitleValid && !hasConflict;


	const handleSave = () => {
		const conflict = slot.some((s) => hasOverlap(allSlots, s));
		if (conflict){
			alert("시간이 겹치는 수업은 추가할 수 없습니다.");
			return;
		}

		const item: Course = {
			id: nextIdRef.current,
			year: year,
			semester: semester,
			courseTitle: title.trim(),
			source: "CUSTOM",  // 이후 강의 크롤링 가능하면 수정해야 함
			timeSlots: slot,
			courseNumber: undefined,
			lectureNumber: undefined,
			credit: credit,
			instructor: professor.trim() || undefined,
		};

		const {id, ...body} = item;

		onAdd(item.id, body);
		nextIdRef.current += 1;

		//reset
		setTitle("");
		setProfessor("");
		setSlot([emptyRow()]);
	};

	return (
		<aside className="tt-panel">
			<SlArrowRight onClick={() => setIsClicked(false)} />
			<h2>새 수업 추가</h2>
			<label className="tt-field input">
				<div>과목명 (필수)</div>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="경제학개론"
				/>
			</label>

			<label className="tt-field input">
				<div>교수명 (선택)</div>
				<input
					value={professor}
					onChange={(e) => setProfessor(e.target.value)}
					placeholder="박이택"
				/>
			</label>

			<label className="tt-field input">
				<div>학점 (선택)</div>
				<input
					type="number"
					value={credit}
					onChange={(e) => {
						const value = e.target.value;
						setCredit(value === "" ? undefined : Number(value));
						}}
					placeholder="3"
					min={0}
					step={1}
				/>
			</label>

			<div>
				<div>
					<div>시간 (필수)</div>
				</div>
				{slot.map((t) => (
					<div key={t.rowId}>
						<div className="timeslot-delete">
							<TiDelete onClick={() => removeRow(t.rowId)} />
						</div>
						<div className="tt-dayButtons">
							{DAYS.map((d) => (
								<button
									key={d}
									type="button"
									className={`tt-dayBtn ${t.day === d ? "is-active" : ""}`}
									onClick={() => updateRow(t.rowId, { day: d })}
								>
									{DAY_LABELS_KO[d]}
								</button>
							))}
						</div>

						<div className="tt-timeRange">
							<select
								value={t.startMin}
								onChange={(e) =>
									updateRow(t.rowId, { startMin: Number(e.target.value) })
								}
							>
								{timeOptions.map((o) => (
									<option key={o.value} value={o.value}>
										{o.label}
									</option>
								))}
							</select>
							<span className="tt-tilde">~</span>

							<select
								value={t.endMin}
								onChange={(e) =>
									updateRow(t.rowId, { endMin: Number(e.target.value) })
								}
							>
								{timeOptions.map((o) => (
									<option key={o.value} value={o.value}>
										{o.label}
									</option>
								))}
							</select>
						</div>
					</div>
				))}

				<button className="tt-link" type="button" onClick={() => addRow()}>
					+ 시간 추가
				</button>

				{!isTimeRangeValid && (
					<div className="tt-error">
						{" "}
						시간 범위가 잘못되었습니다. (종료가 시작보다 늦어야 하고 5분
						단위여야 합니다. )
					</div>
				)}
				{!isTitleValid && (
					<div className="tt-error">과목 이름은 필수입니다.</div>
				)}
			</div>
			<button
				className="tt-save"
				type="button"
				disabled={!canSave}
				onClick={handleSave}
			>
				저장
			</button>
		</aside>
	);
}
