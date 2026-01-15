import { useMemo, useState } from "react";
import type { Course, Day, TimeSlot } from "../util/types";
import { DAY_LABELS_KO } from "../util/types";
import { buildTimeOptions, STEP_MIN, snapToStep } from "./time";

type Props = {
	onAdd: (item: Course) => void;
	existingSlots: TimeSlot[];
};

const DAYS: Day[] = [0, 1, 2, 3, 4, 5, 6];

export function AddClassPanel({ onAdd }: Props) {
	const timeOptions = useMemo(() => buildTimeOptions(STEP_MIN), []);
	const [title, setTitle] = useState("");
	const [professor, setProfessor] = useState("");

	const [day, setDay] = useState<Day>(0);
	const [startMin, setStartMin] = useState(8 * 60);
	const [endMin, setEndMin] = useState(11 * 60);

	const valid =
		title.trim().length > 0 &&
		endMin > startMin &&
		startMin % STEP_MIN === 0 &&
		endMin % STEP_MIN === 0;

	const nextId = 0;

	const handleSave = () => {
		if (!valid) return;

		const item: Course = {
			id: nextId,
			courseTitle: title.trim(),
			instructor: professor.trim() || undefined,
			year: 2025, // 현재 시간으로 동기화 필요
			semester: "SPRING", // 현재 학기로 동기화 필요
			slot: [
				{
					day,
					startMin: snapToStep(startMin, STEP_MIN),
					endMin: snapToStep(endMin, STEP_MIN),
				},
			],
		};
		onAdd(item);

		//reset
		setTitle("");
		setProfessor("");
	};

	return (
		<aside className="tt-panel">
			<h2>새 수업 추가</h2>
			<label>
				<div>과목명 (필수)</div>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="경제학개론"
				/>
			</label>

			<label>
				<div>교수명 (선택)</div>
				<input
					value={professor}
					onChange={(e) => setProfessor(e.target.value)}
					placeholder="박이택"
				/>
			</label>

			<div>
				<div>시간 (필수)</div>
				<div>
					{DAYS.map((d) => (
						<button
							key={d}
							type="button"
							className={`tt-dayBtn ${day === d ? "is-active" : ""}`}
							onClick={() => setDay(d)}
						>
							{DAY_LABELS_KO[d]}
						</button>
					))}
				</div>

				<div>
					<select
						value={startMin}
						onChange={(e) => setStartMin(Number(e.target.value))}
					>
						{timeOptions.map((o) => (
							<option key={o.value} value={o.value}>
								{o.label}
							</option>
						))}
					</select>
					<span className="tt-tilde">~</span>

					<select
						value={endMin}
						onChange={(e) => setEndMin(Number(e.target.value))}
					>
						{timeOptions.map((o) => (
							<option key={o.value} value={o.value}>
								{o.label}
							</option>
						))}
					</select>
				</div>

				<button
					className="tt-link"
					type="button"
					onClick={() => alert("+ 시간 추가")}
				>
					+ 시간 추가
				</button>

				{!valid && (
					<div className="tt-error">
						{" "}
						시간 범위가 잘못되었습니다. (종료가 시작보다 늦어야 하고 5분
						단위여야 합니다. )
					</div>
				)}
			</div>
			<button
				className="tt-save"
				type="button"
				disabled={!valid}
				onClick={handleSave}
			>
				저장
			</button>
		</aside>
	);
}
