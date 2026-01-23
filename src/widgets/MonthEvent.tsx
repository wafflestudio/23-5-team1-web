import { CATEGORY_COLORS } from "../util/constants";
import type { CalendarEvent } from "../util/types";
import styles from "../styles/MonthEvent.module.css"

const MonthEvent = ({ event: calendarEvent }: { event: CalendarEvent }) => {
    const { isPeriodEvent, event } = calendarEvent.resource;
    const color = CATEGORY_COLORS[event.eventTypeId] || CATEGORY_COLORS[6];

    // 기간제 행사 : 화살표
    if (isPeriodEvent) {
        return (
            <div className={styles.arrowEventContainer} style={{ color: color }}>
                <span className={styles.arrowText}>{event.title}</span>
                <div className={styles.arrowLine} style={{ backgroundColor: color }}>
                    <div
                        className={styles.arrowHead}
                        style={{ borderLeftColor: color }}
                    />
                </div>
            </div>
        );
    }
    // 단발성 행사 : 블록
    return (
        <div
            className={styles.blockEventContainer}
            style={{
                backgroundColor: color,
            }}
        >
            {event.title}
        </div>
    );
};

export default MonthEvent;