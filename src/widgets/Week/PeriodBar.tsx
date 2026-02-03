import {useMemo, useCallback} from "react";
import type { PeriodEvent } from "@/util/types";
import { clampDate, dayIndexFromWeekStart } from "@/util/weekly_timetable/time";

type Props = {
    date: Date;
    items: PeriodEvent[];
    laneHeight?: number;
    laneGap?: number;
    bottomOffset?: number;
    onClickItem?: (ev: PeriodEvent) => void;
};

type Bar = {
    id: string | number;
    title: string;
    startIdx: number;
    endIdx: number;
    showLeftArrow: boolean;
    showRightArrow: boolean;
    raw: PeriodEvent;
};

function startOfWeekSunday(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - x.getDay());
    return x;
}

function endOfWeekSaturday(d: Date) {
    const start = startOfWeekSunday(d);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
}

function assignLanes(bars: Bar[]) {
    const lanes: Bar[][] = [];
    const placed: Array<Bar & {lane: number}> = [];

    const sorted = [...bars].sort((a, b) => a.startIdx - b.startIdx || a.endIdx - b.endIdx);

    sorted.forEach((bar) => {
        let lane = 0;
        while(true) {
            const laneBars = lanes[lane] ?? [];
            const conflict = laneBars.some(
                (x) => !(bar.endIdx < x.startIdx || bar.startIdx > x.endIdx),
            );
            if (!conflict) {
                if(!lanes[lane]) lanes[lane] = [];
                lanes[lane].push(bar);
                placed.push({...bar, lane});
                break;
            }
            lane += 1;
        }
    });

    return placed;
}

export function PeriodBars({
    date,
    items,
    laneHeight = 22,
    laneGap = 6,
    bottomOffset = 8,
    onClickItem,
}: Props) {
    const weekStart = useMemo(() => startOfWeekSunday(date), [date]);
    const weekEnd = useMemo(() => endOfWeekSaturday(date), [date]);

    const barsWithLane = useMemo(() => {
        const bars: Bar[] = (items ?? [])
            .filter((ev) => ev?.applyStart && ev?.applyEnd)
            .map((ev) => {
                const start = ev.applyStart;
                const end = ev.applyEnd;

                const showLeftArrow = start.getTime() < weekStart.getTime();
                const showRightArrow = end.getTime() > weekEnd.getTime();

                const clampedStart = clampDate(start, weekStart, weekEnd);
                const clampedEnd = clampDate(end, weekStart, weekEnd);

                const startIdx = dayIndexFromWeekStart(weekStart, clampedStart);
                const endIdx = dayIndexFromWeekStart(weekStart, clampedEnd);

                return {
                    id: ev.id,
                    title: ev.title,
                    startIdx,
                    endIdx,
                    showLeftArrow,
                    showRightArrow,
                    raw: ev,
                };
            })
            .filter((b) => b.endIdx >= 0 && b.startIdx <= 6);

            return assignLanes(bars);
    }, [items, weekStart, weekEnd]);

    const laneCount = useMemo(() => {
        return barsWithLane.reduce((m, b) => Math.max(m, b.lane), -1) + 1;
    }, [barsWithLane]);

    const handleClick = useCallback(
        (ev:PeriodEvent) => {
            onClickItem?.(ev);
        },
        [onClickItem],
    );

    return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: bottomOffset,
        height: laneCount * laneHeight + Math.max(0, laneCount - 1) * laneGap,
        pointerEvents: "none", // 바 자체만 클릭 가능하게 하려면 버튼에만 pointerEvents 켜기
        zIndex: 20,
      }}
    >
      {barsWithLane.map((b) => {
        const leftPct = (b.startIdx / 7) * 100;
        const widthPct = ((b.endIdx - b.startIdx + 1) / 7) * 100;

        return (
          <button
            key={String(b.id)}
            type="button"
            onClick={() => handleClick(b.raw)}
            style={{
              position: "absolute",
              left: `${leftPct}%`,
              width: `${widthPct}%`,
              bottom: b.lane * (laneHeight + laneGap),
              height: laneHeight,
              border: "none",
              background: "transparent",
              padding: 0,
              margin: 0,
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            title={b.title}
          >
            <div
              style={{
                height: 3,
                borderRadius: 999,
                background: "currentColor",
                opacity: 0.95,
                marginTop: 10,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "currentColor",
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "22px",
              }}
            >
              <span style={{ width: 18, textAlign: "left" }}>
                {b.showLeftArrow ? "←" : ""}
              </span>

              <span
                style={{
                  flex: 1,
                  textAlign: "center",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  padding: "0 6px",
                }}
              >
                {b.title}
              </span>

              <span style={{ width: 18, textAlign: "right" }}>
                {b.showRightArrow ? "→" : ""}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}