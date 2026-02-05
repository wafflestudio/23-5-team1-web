import { useState } from "react";
import { addBookmark, removeBookmark } from "@api/user";
import styles from "@styles/CardView.module.css";
import { formatDateDotParsed } from "@calendarUtil/dateFormatter";
import { getDDay } from "@calendarUtil/getDday";
import { CATEGORY_COLORS, CATEGORY_LIST } from "@constants";
import type { Event } from "@types";

const CardView = ({ event }: { 
	event: Event; 
}) => {
	const [isBookmarked, setIsBookmarked] = useState<boolean>(
		event.isBookmarked || false,
	);
	const ddayTargetDate = event.eventStart ? event.eventStart : event.applyEnd;

	const handleToggleBookmark = async (
		e: React.MouseEvent<HTMLButtonElement>,
	) => {
		const previousState = isBookmarked;
		e.stopPropagation();

		// optimistic update
		setIsBookmarked(!previousState);

		try {
			if (previousState) {
				await removeBookmark(event.id);
			} else {
				await addBookmark(event.id);
			}
		} catch (e) {
			console.error("Failed to toggle bookmark", e);
			setIsBookmarked(previousState);
		}
	};

	return (
		<div className={styles.cardWrapper}>
			<button type="button" onClick={handleToggleBookmark}>
				<img
					src={
						isBookmarked
							? "/assets/Bookmarked.svg"
							: "/assets/notBookmarked.svg"
					}
					alt={isBookmarked ? "Remove bookmark" : "Add bookmark"}
				/>
			</button>
			<h1 className={styles.eventTitle}>{event.title}</h1>
			<span className={styles.dateText}>
				{
					// !event.eventStart : 기간제 행사, yyyy.mm.dd ~ yyyy.mm.dd로 표시
					event.eventStart && event.eventEnd
						? // 단발성 행사
							event.eventStart === event.eventEnd
							? // yyyy.mm.dd만 표시
								formatDateDotParsed(event.eventStart)
							: // yyyy.mm.dd ~ yyyy.mm.dd
								`${formatDateDotParsed(event.eventStart)} ~ ${formatDateDotParsed(event.eventEnd)}`
						: // 기간제 행사
							`${formatDateDotParsed(event.applyStart)} ~ ${formatDateDotParsed(event.applyEnd)}`
				}
			</span>
			<ul className={styles.chipsList}>
				<li className={styles.deadlineChip}>{getDDay(ddayTargetDate)}</li>
				<li
					className={styles.categoryChip}
					style={{
						backgroundColor: CATEGORY_COLORS[event.eventTypeId],
					}}
				>
					{CATEGORY_LIST[event.eventTypeId]}
				</li>
			</ul>
			<span className={styles.orgText}>{event.organization}</span>
		</div>
	);
};

export default CardView;
