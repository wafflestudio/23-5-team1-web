import {useMemo} from "react";
import { DAY_LABELS_KO, type Day } from "../../util/types";
import type { GridConfig, WeekGridBlock } from "../../util/weekly_timetable/layout";
import { formatAmPmFromMinutes } from "../../util/weekly_timetable/time";

export type WeekGridProps<T> = {
    items: T[];
    config: GridConfig;
    toBlocks: (items: T[], config: GridConfig) => WeekGridBlock<T>[];
    onSelectBlock?: (id: number, item: T) => void;
    dayLabels?: Record<Day, string>;
}

const Days: Day[] = [0, 1, 2, 3, 4, 5, 6];

export function WeekGrid<T>({
    items,
    config,
    toBlocks,
    dayLabels = DAY_LABELS_KO,
}: WeekGridProps<T>) {
    const blocks = useMemo(() => toBlocks(items, config), [items, config, toBlocks]);
    const totalHeight = config.endHour * 60 * config.ppm;
    const hourMarks = useMemo(() => {
        const list: { hour: number; top: number; label: string }[] = [];
        for (let h = config.startHour; h <= config.endHour; h++) {
            const top = (h * 60 - config.startHour * 60) * config.ppm;
            const labelHour = formatAmPmFromMinutes(h * 60);
            list.push({ hour: h, top, label: labelHour });
        }
        return list;
    }, [config]);
    const blocksByDay = useMemo(() => {
        const map: Record<Day, WeekGridBlock<T>[]> = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
        for (const b of blocks) map[b.day].push(b);
        return map;
    }, [blocks]);

  return (
    <div className="tt-gridWrap">
      <div className="tt-headerRow">
        <div className="tt-timeGutterHeader" />
        {Days.map((d) => (
          <div key={d} className="tt-dayHeader">
            {dayLabels[d]}
          </div>
        ))}
      </div>

      <div className="tt-body">
        <div className="tt-timeGutter" style={{ height: totalHeight }}>
          {hourMarks.map((m) => (
            <div key={m.hour} className="tt-hourLabel" style={{ top: m.top }}>
              {m.label}
            </div>
          ))}
        </div>

        <div className="tt-days" style={{ height: totalHeight }}>
          {Days.map((d) => (
            <DayColumn<T>
              key={d}
              height={totalHeight}
              blocks={blocksByDay[d]}
              config={config}
              //onSelectBlock={onSelectBlock}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DayColumn<T>({
    height,
    blocks,
    config,
    onSelectBlock,
}: {
    height: number;
    blocks: WeekGridBlock<T>[];
    config: GridConfig;
    onSelectBlock?: (id: number, item: T) => void;
}) {

    return (
        <div>
            <GridLines height={height} cfg={config} />
            {blocks.map((b) => (
                <button
                    key={b.id}
                    className="tt-block"
                    style={{ top: b.top, height: b.height }}
                    onClick={() => onSelectBlock?.(b.id, b.raw)}
                    type="button"
                >
                    <div className="tt-blockTitle">{b.title}</div>
                    <div className="tt-blockTime">
                        {formatAmPmFromMinutes(b.startMin)} - {formatAmPmFromMinutes(b.endMin)}
                    </div>
                </button>
            ))}
        </div>
    );
}

function GridLines({ height, cfg }: { height: number; cfg: GridConfig }) {
    const stepPx = cfg.ppm * 30;
    const count = Math.floor(height / stepPx);
    return (
        <div className="tt-lines">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i * stepPx}
                    className="tt-line"
                    style={{ top: i * 30 * cfg.ppm }}
                />
            ))}
        </div>
    );
}