import { useMemo } from "react";
import type { Course, Day } from "../util/types";
import { DAY_LABELS_KO } from "../util/types";
import { flattenToBlocks, type GridConfig } from "./layout";
import { formatAmPmFromMinutes } from "./time";
import "./timetable.css";

type Props = {
	courses: Course[];
	config: GridConfig;
	onSelectClass?: (id: number) => void;
};

const Days: Day[] = [0, 1, 2, 3, 4, 5, 6];

export function WeekGrid({ courses, config, onSelectClass }: Props) {
	const blocks = useMemo(
		() => flattenToBlocks(courses, config),
		[courses, config],
	);
	const totalHeight =
		(config.endHour * 60 - config.startHour * 60) * config.ppm;

	// 시간 라벨링(1시간 단위)
	const hourMarks = useMemo(() => {
		const list: { hour: number; top: number; label: string }[] = [];
		for (let h = config.startHour; h <= config.endHour; h++) {
			const top = (h * 60 - config.startHour * 60) * config.ppm;
			const labelHour = formatAmPmFromMinutes(h * 60);
			list.push({ hour: h, top, label: labelHour });
		}
		return list;
	}, [config]);
	return (
		<div className="tt-gridWrap">
			{/* 요일 헤더 */}
			<div className="tt-headerRow">
				<div className="tt-timeGutterHeader" />
				{Days.map((d) => (
					<div key={d} className="tt-dayHeader">
						{DAY_LABELS_KO[d]}
					</div>
				))}
			</div>

			{/* 본문 */}
			<div className="tt-body">
				{/* 왼쪽 시간 축 */}
				<div className="tt-timeGutter" style={{ height: totalHeight }}>
					{hourMarks.map((m) => (
						<div key={m.hour} className="tt-hourLabel" style={{ top: m.top }}>
							{m.label}
						</div>
					))}
				</div>

				{/* 요일 컬럼 */}
				<div className="tt-days" style={{ height: totalHeight }}>
					{Days.map((d) => (
						<DayColumn
							key={d}
							height={totalHeight}
							blocks={blocks.filter((b) => b.day === d)}
							config={config}
							onSelectClass={onSelectClass}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function DayColumn({
	//day,
	height,
	blocks,
	config,
	onSelectClass,
}: {
	//day: Day;
	height: number;
	blocks: ReturnType<typeof flattenToBlocks>;
	config: GridConfig;
	onSelectClass?: (classId: number) => void;
}) {
	return (
		<div>
			<GridLines height={height} cfg={config} />
			{blocks.map((b) => (
				<button
					key={b.id}
					className="tt-block"
					style={{ top: b.top, height: b.height }}
					onClick={() => onSelectClass?.(b.id)}
					type="button"
				>
					<div className="tt-blockTitle">{b.title}</div>
					<div className="tt-blockTime">
						{formatAmPmFromMinutes(b.startMin)} -{" "}
						{formatAmPmFromMinutes(b.endMin)}
					</div>
				</button>
			))}
		</div>
	);
}

function GridLines({ height, cfg }: { height: number; cfg: GridConfig }) {
	const stepPx = cfg.ppm * 30;
	const count = Math.floor((height / stepPx) * 2);
	return (
		<div className="tt-lines">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i * stepPx} className="tt-line" style={{ top: i * 60 }} />
			))}
		</div>
	);
}
