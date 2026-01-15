import { useMemo, useState } from "react";
import type { Course, Day, TimeSlot } from "../../util/types";
import { DAY_LABELS_KO } from "../../util/types";
import { buildTimeOptions, STEP_MIN, snapToStep } from "./time";

type Props = {
	onAdd: (item: Course) => void;
	existingSlots: TimeSlot[];
};
type SlotRow =TimeSlot & {rowId: string};

const DAYS: Day[] = [0, 1, 2, 3, 4, 5, 6];

export function AddClassPanel({ onAdd }: Props) {
	const timeOptions = useMemo(() => buildTimeOptions(STEP_MIN), []);
	const [title, setTitle] = useState("");
	const [professor, setProfessor] = useState("");

	const emptyRow = (): SlotRow => ({
		rowId: crypto.randomUUID(),
		day: 0,
		startMin: 8 * 60,
		endMin: 11 * 60
	});

	const [slot, setSlot] = useState<SlotRow[]>([emptyRow()]);
	const addRow = () => setSlot((prev) => [...prev, emptyRow()]);
	const removeRow = (rowId: string) => setSlot((prev) => prev.filter((t) => t.rowId !== rowId))
	const updateRow = (rowId: string, patch: Partial<TimeSlot>) => setSlot((prev) => prev.map((r) => (r.rowId === rowId ? {...r, ...patch} : r)));

	const timeValidCheck = (startMin: number, endMin: number) => 
		endMin > startMin &&
		startMin % STEP_MIN === 0 &&
		endMin % STEP_MIN === 0;
	
	const valid = title.trim().length > 0 && timeValidCheck;

	const timeValid = (arr: boolean[]) => (arr.every((x) => x))

	const nextId = 0;

	const handleSave = () => {
		if (!valid) return;

		const item: Course = {
			id: nextId,
			courseTitle: title.trim(),
			instructor: professor.trim() || undefined,
			year: 2025, // 현재 시간으로 동기화 필요
			semester: "SPRING", // 현재 학기로 동기화 필요
			slot: slot,
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
				{slot.map((t) => (
					<div key={t.rowId}><div>
						{DAYS.map((d) => (
							<button
								key={d}
								type="button"
								className={`tt-dayBtn ${t.day === d ? "is-active" : ""}`}
								onClick={() => updateRow(t.rowId, {day: d})}
							>
								{DAY_LABELS_KO[d]}
							</button>
						))}
					</div>

					<div>
						<select
							value={t.startMin}
							onChange={(e) => updateRow(t.rowId, {startMin: Number(e.target.value)})}
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
							onChange={(e) => updateRow(t.rowId, {endMin: Number(e.target.value)})}
						>
							{timeOptions.map((o) => (
								<option key={o.value} value={o.value}>
									{o.label}
								</option>
							))}
						</select>
					</div></div>
				))}

				<button
					className="tt-link"
					type="button"
					onClick={() => addRow()}
				>
					+ 시간 추가
				</button>

				{ !timeValid(slot.map((t) => (timeValidCheck(t.startMin, t.endMin)))) && (
					<div className="tt-error">
						{" "}
						시간 범위가 잘못되었습니다. (종료가 시작보다 늦어야 하고 5분
						단위여야 합니다. )
					</div>
				)}
				{title.trim().length === 0 && (
					<div className="tt-error">
						과목 이름은 필수입니다. 
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
