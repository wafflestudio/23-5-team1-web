import { useMemo } from "react";
import type { DateLocalizer } from "react-big-calendar";
import type { CalendarEvent } from "../../util/types";
import styles from "./AllDayBar.module.css";

type Props = {
  date: Date;
  localizer: DateLocalizer;
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
};

/**
 * 주 범위(일~토) 안에서 이벤트를 잘라서 표시
 * - gridColumnStart/End로 span
 * - 같은 줄에서 겹치면 아래 줄로 밀어 스택
 */
export function AllDayBar({ date, localizer, events, onSelectEvent }: Props) {
  const weekDays = useMemo(() => {
    // culture는 여기서는 생략(필요하면 Props로 받거나 고정)
    const firstDayOfWeek = localizer.startOfWeek?.("ko") ?? 0;
    const start = localizer.startOf(date, "week", firstDayOfWeek);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) days.push(localizer.add(start, i, "day"));
    return days;
  }, [date, localizer]);

  const weekStart = useMemo(() => {
    const d = weekDays[0];
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  }, [weekDays]);

  const weekEndExclusive = useMemo(() => {
    // week 마지막 날 다음날 00:00 (exclusive)
    const last = weekDays[6];
    const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1, 0, 0, 0, 0);
    return next;
  }, [weekDays]);

  const clipped = useMemo(() => {
    // allDayBar는 allDay=true인 이벤트만 받는다고 가정해도 되지만,
    // 방어적으로 allDay 필터 한 번 더.
    return (events ?? [])
      .filter((e) => e?.allDay)
      .map((e) => {
        const start = new Date(e.start);
        const end = new Date(e.end);

        // week 범위를 벗어나면 제거
        if (end <= weekStart || start >= weekEndExclusive) return null;

        // week 범위로 clip
        const s = start < weekStart ? weekStart : start;
        const ed = end > weekEndExclusive ? weekEndExclusive : end;

        // 날짜 index 계산 (0~6)
        const sDay = new Date(s.getFullYear(), s.getMonth(), s.getDate(), 0, 0, 0, 0);
        const eDay = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate(), 0, 0, 0, 0);

        const startIdx = Math.max(
          0,
          Math.floor((sDay.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000)),
        );

        // end가 “exclusive”처럼 들어오는 경우가 있어서,
        // end가 딱 자정이면 하루 덜 span 되게 처리
        let endIdx = Math.floor((eDay.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000));
        const isEndAtMidnight = ed.getHours() === 0 && ed.getMinutes() === 0 && ed.getSeconds() === 0;
        if (isEndAtMidnight) endIdx = Math.max(startIdx, endIdx - 1);

        endIdx = Math.min(6, endIdx);

        return {
          original: e,
          startIdx,
          endIdx,
        };
      })
      .filter(Boolean) as { original: CalendarEvent; startIdx: number; endIdx: number }[];
  }, [events, weekStart, weekEndExclusive]);

  const placed = useMemo(() => {
    // 간단 스택 배치: 같은 row에서 겹치면 다음 row로
    const rows: Array<Array<{ ev: CalendarEvent; s: number; e: number }>> = [];

    // 시작순 정렬
    const sorted = [...clipped].sort((a, b) => a.startIdx - b.startIdx || a.endIdx - b.endIdx);

    sorted.forEach(({ original, startIdx, endIdx }) => {
      let row = 0;
      while (true) {
        if (!rows[row]) rows[row] = [];

        const conflict = rows[row].some((it) => !(endIdx < it.s || startIdx > it.e));
        if (!conflict) {
          rows[row].push({ ev: original, s: startIdx, e: endIdx });
          break;
        }
        row += 1;
      }
    });

    return rows;
  }, [clipped]);

  return (
    <div className={styles.allDayWrap}>
      <div className={styles.grid}>
        {placed.map((row, rIdx) =>
          row.map(({ ev, s, e }, i) => (
            <button
              key={`${rIdx}-${i}-${ev.title}`}
              type="button"
              className={styles.item}
              style={{
                gridColumnStart: s + 1,
                gridColumnEnd: e + 2, // end는 inclusive라 +2
                gridRowStart: rIdx + 1,
              }}
              onClick={() => onSelectEvent?.(ev)}
              title={ev.title}
            >
              {ev.title}
            </button>
          )),
        )}
      </div>
    </div>
  );
}

export default AllDayBar;
