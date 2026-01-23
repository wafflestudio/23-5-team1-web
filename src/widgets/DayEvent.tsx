import { CATEGORY_COLORS } from "../util/constants";
import type { CalendarEvent } from "../util/types";
import styles from '../styles/DayEvent.module.css'
import { formatDateDotParsed } from "../util/Calendar/dateFormatter";

const DayEvent = ({ event : calendarEvent }: { event: CalendarEvent }) => {
    const { event } = calendarEvent.resource;
    const color = CATEGORY_COLORS[event.eventTypeId] || CATEGORY_COLORS[6];

    return (
        <div
            className={styles.dayEventContainer}
            style={{
                backgroundColor: color,
            }}
        >
            <div className={`${styles.eventContent} ${styles.eventTitle}`}>
                {event.title}
            </div>
            <div className={`${styles.eventContent} ${styles.eventMeta}`}>
                {   formatDateDotParsed(calendarEvent.start) === formatDateDotParsed(calendarEvent.end) ?
                    formatDateDotParsed(calendarEvent.start)
                    :
                    `${formatDateDotParsed(calendarEvent.start)} ~ ${formatDateDotParsed(calendarEvent.end)}`
                }
            </div>
            <div className={`${styles.eventContent} ${styles.eventMeta}`} >
                {
                    event.location==='-' ? '' : event.location
                }
            </div>
        </div>
    )
}

export default DayEvent;