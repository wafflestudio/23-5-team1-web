import {useMemo, useCallback} from "react";
import type { PeriodEvent, Event } from "@/util/types";
import { clampDate, dayIndexFromWeekStart } from "@/util/weekly_timetable/time";
import styles from  "@styles/PeriodBar.module.css";
import { CATEGORY_COLORS } from "@/util/constants";
import type { CSSProperties } from "react";

type Props = {
    date: Date;
    items: PeriodEvent[];
    laneHeight?: number;
    laneGap?: number;
    bottomOffset?: number;
    onSelectEvent?: (event: Event) => void;
};

type Bar = {
    id: string | number;
    title: string;
    startIdx: number;
    endIdx: number;
    raw: PeriodEvent;
};

type CSSVarStyle = CSSProperties & {
  [key: `--${string}`]: string;
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

function truncate30(s: string) {
  if (!s) return "";
  return s.length > 30 ? `${s.slice(0, 30)}…` : s;
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
    onSelectEvent,
}: Props) {
    const weekStart = useMemo(() => startOfWeekSunday(date), [date]);
    const weekEnd = useMemo(() => endOfWeekSaturday(date), [date]);

    const barsWithLane = useMemo(() => {
        const bars: Bar[] = (items ?? [])
            .filter((ev) => ev?.applyStart && ev?.applyEnd)
            .map((ev) => {
                const start = ev.applyStart;
                const end = ev.applyEnd;

                const showLeftArrow = start.getTime() >= weekStart.getTime();
                const showRightArrow = end.getTime() <= weekEnd.getTime();

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
            onSelectEvent?.(ev);
        },
        [onSelectEvent],
    );

    return (
    <div
      className={styles.container}
      style={{
        bottom: bottomOffset,
        height: laneCount * laneHeight + Math.max(0, laneCount - 1) * laneGap,
      }}
    >

      {barsWithLane.map((b) => {
        const dayGap = 10;
        const sidePad = 10;
        const span = b.endIdx - b.startIdx + 1;

        const leftPct = (b.startIdx / 7) * 100;
        const widthPct = (span / 7) * 100;

        const leftPx = sidePad + b.startIdx * dayGap;
        const widthPx = (span - 1) * dayGap - sidePad * 2;

        const displayTitle = truncate30(b.title);

        const categoryId = b.raw.eventTypeId;
        const color = CATEGORY_COLORS[categoryId] ?? "#999";

        const style: CSSVarStyle = {
          left: `calc(${leftPct}% + ${leftPx}px)`,
          width: `calc(${widthPct}% + ${widthPx}px)`,
          bottom: b.lane * (laneHeight + laneGap),
          height: laneHeight,

          "--period-line": color,
          "--period-text": color,
        };

        return (
          <button
            key={String(b.id)}
            type="button"
            onClick={() => handleClick(b.raw)}
            className={styles.bar}
            style={style}
            title={b.title}
          >
            <div className={styles.line} />

            <div className={`${styles.label}`}>
              <span className={styles.title}>{displayTitle}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}