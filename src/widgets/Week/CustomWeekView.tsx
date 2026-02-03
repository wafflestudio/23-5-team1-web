import React, { useCallback, useMemo } from "react";
import type {
  DateLocalizer,
  NavigateAction,
  ViewStatic,
} from "react-big-calendar";

import type { Event, CalendarEvent, PeriodEvent } from "../../util/types";
import { config, flattenEventsToBlocks } from "../../util/weekly_timetable/layout";
import { WeekGrid } from "./WeekGrid";
import { PeriodBars } from "./PeriodBar";
import AllDayBar from "./AllDayBar";

interface CustomWeekViewProps {
  date: Date;
  localizer: DateLocalizer;
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  [key: string]: unknown;
}

function isValidPeriodEvent(ev: Event) : ev is PeriodEvent {
  return ev.applyStart instanceof Date && ev.applyEnd instanceof Date;
}

export function CustomWeekView({ date, localizer, events, onSelectEvent }: CustomWeekViewProps) {
  const WEEK_EVENTS = useMemo(() => {
    return events.map((cevent: CalendarEvent) => {
      let isAllDay = false;
      const sameMinute = Math.floor(cevent.start.getTime() / 60000) === Math.floor(cevent.end.getTime() / 60000);

      if(cevent.start && cevent.end) {
        const startDay = new Date(
          cevent.start.getFullYear(),
          cevent.start.getMonth(),
          cevent.start.getDate(),
        );
        const endDay = new Date(
          cevent.end.getFullYear(),
          cevent.end.getMonth(),
          cevent.end.getDate(),
        );
        const differentDate = startDay.getTime() !== endDay.getTime();
        isAllDay = Boolean(cevent.allDay) || differentDate || sameMinute;
      }

      return {
        ...cevent,
        allDay: isAllDay,
      };
    });
  }, [events]);

  const {allDayCalendarEvents, timetableEvents, periodEvents} = useMemo(() => {
    const src = WEEK_EVENTS ?? [];
    const allDayCalendarEvents = src
      .filter((ce) => ce?.allDay === true && ce.resource.isPeriodEvent === false);
    const timetable = src
      .filter((ce) => ce?.resource?.event && ce.resource.isPeriodEvent === false && ce.allDay === false);

    const period = src
      .filter(
        (ce): ce is CalendarEvent & {
          resource: { event: Event; isPeriodEvent: true };
        } =>
          Boolean(ce?.resource?.event) &&
          ce.resource.isPeriodEvent === true,
      )
      .map((ce) => ce.resource.event)
      .filter(isValidPeriodEvent);
    console.log(WEEK_EVENTS);
    return {
      allDayCalendarEvents,
      timetableEvents: timetable,
      periodEvents: period,
    };
  }, [WEEK_EVENTS]);

  const handleSelectBlock = useCallback(
    (calendarEventLike: CalendarEvent | Event) => {
      // 1) WeekGrid가 CalendarEvent를 넘겨주는 경우(혹시 몰라서)
      if ((calendarEventLike as any)?.resource?.event) {
        onSelectEvent?.(calendarEventLike as CalendarEvent);
        return;
      }

      // 2) WeekGrid가 원본 Event를 넘겨주는 경우(보통 이 케이스)
      const raw = calendarEventLike as Event;
      const found = (events ?? []).find(
        (ce) => ce?.resource?.event?.id === raw.id,
      );

      if (found) {
        onSelectEvent?.(found);
        return;
      }

      // 3) 혹시 매칭이 안 되면 최소한의 CalendarEvent를 만들어 전달(안전장치)
      // start/end는 WeekGrid가 쓰는 필드 기준으로 추정
      const start = raw.eventStart || raw.applyStart;
      const end = raw.eventEnd || raw.applyEnd;

      onSelectEvent?.({
        start: new Date(start),
        end: new Date(end),
        title: raw.title,
        allDay: true,
        resource: { event: raw, isPeriodEvent: !raw.eventStart },
      } as unknown as CalendarEvent);
    },
    [events, onSelectEvent],
  );

  return (
    <div style={{ height: "100%" }}>
      <AllDayBar 
      date={date}
      localizer={localizer}
      events={allDayCalendarEvents}
      onSelectEvent={onSelectEvent}
    />
      <WeekGrid
        items={timetableEvents}
        config={config}
        toBlocks={flattenEventsToBlocks}
        onSelectBlock={handleSelectBlock}
      />
      <PeriodBars
        date={date}
        items={periodEvents}
        onClickItem={(ev) => {
          // period event 클릭 시 동작(상세 열기 등)
          // onSelectEvent는 CalendarEvent 타입이라면 여기서는 따로 핸들링하거나
          // Event 기반 상세 오픈 함수를 하나 더 두는 게 깔끔해.
          console.log("period event clicked:", ev);
        }}
      />
    </div>
  );
}

/** ✅ react-big-calendar이 요구하는 ViewStatic 붙이기 */
// 1) range
CustomWeekView.range = (date: Date, options: any): Date[] => {
  const localizer = options?.localizer as DateLocalizer;
  const culture = options?.culture as string | undefined;

  // culture가 없을 수도 있으니 안전 처리
  const firstDayOfWeek = localizer.startOfWeek?.(culture ?? "ko") ?? 0;

  const start = localizer.startOf(date, "week", firstDayOfWeek);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(localizer.add(start, i, "day"));
  }
  return days;
};

// 2) navigate
CustomWeekView.navigate = (
  date: Date,
  action: NavigateAction,
  options: any,
) => {
  const localizer = options?.localizer as DateLocalizer;

  switch (action) {
    case "PREV":
      return localizer.add(date, -1, "week");
    case "NEXT":
      return localizer.add(date, 1, "week");
    default:
      return date;
  }
};

// 3) title 
CustomWeekView.title = (date: Date, options: any) => {
  const localizer = options?.localizer as DateLocalizer;
  const culture = (options?.culture as string | undefined) ?? "ko";

  const days = CustomWeekView.range(date, { localizer, culture });
  const start = days[0];
  const end = days[days.length - 1];

  const startLabel = localizer.format(start, "MMM dd", culture);
  const endLabel = localizer.format(end, "MMM dd", culture);

  return `${startLabel} – ${endLabel}`;
};

export default CustomWeekView as unknown as React.ComponentType<any> & ViewStatic;
