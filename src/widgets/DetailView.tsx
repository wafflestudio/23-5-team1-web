import { addBookmark, removeBookmark } from "../api/user";
import { useEvents } from "../contexts/EventContext";
import { useEffect, useState } from "react";
import styles from "../styles/DetailView.module.css";
import { formatDateDotParsed } from "../util/Calendar/dateFormatter";
import { getDDay } from "../util/Calendar/getDday";
import { CATEGORY_COLORS, CATEGORY_LIST } from "../util/constants";
import { FaAnglesRight } from "react-icons/fa6";
import { TiPencil } from "react-icons/ti";
import type { EventDetail } from "../util/types";
import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";

const DetailView = ({
	eventId,
	onClose,
}: {
	eventId: number;
	onClose: () => void;
}) => {
	const [event, setEvent] = useState<EventDetail>();
	const { fetchEventById } = useEvents();

	useEffect(() => {
		const loadEvent = async () => {
			const event = await fetchEventById(eventId);
			setEvent(event ?? undefined);
		};
		loadEvent();
	}, [eventId, fetchEventById]);

	const ddayTargetDate = event
		? event.eventStart
			? event.eventStart
			: event.applyEnd
		: undefined;
	const [isBookmarked, setIsBookmarked] = useState<boolean>(
		!!event?.isBookmarked,
	);

	useEffect(() => {
		if (event) {
			setIsBookmarked(event.isBookmarked ? event.isBookmarked : false);
		}
	}, [event]);

	if (!event) return null;

	const handleToggleBookmark = async () => {
		const previousState = isBookmarked;

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
		<div className={styles.container}>
			<button type="button" className={styles.foldBtn}>
				<FaAnglesRight
					width={18}
					height={18}
					color="rgba(171, 171, 171, 1)"
					onClick={onClose}
				/>
			</button>

			<img
				className={styles.thumbnail}
				src={event.imageUrl}
				alt="thumbnail of event"
			/>
			<button
				className={styles.bookmarkBtn}
				type="button"
				onClick={handleToggleBookmark}
			>
				<img
					src={
						isBookmarked
							? "/assets/Bookmarked.svg"
							: "/assets/notBookmarked.svg"
					}
					alt={isBookmarked ? "Remove bookmark" : "Add bookmark"}
				/>
			</button>
			<h1 className={styles.title}>{event.title}</h1>
			<span className={styles.date}>
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
			<button
				type="button"
				className={styles.applyBtn}
				onClick={() => window.open(event.applyLink, "_blank")}
			>
				지원 링크로 이동하기
			</button>
			<div className={`${styles.contentText} html-viewer`}>
				<hr style={{ borderWidth: "0.5px" }} />
				{parse(DOMPurify.sanitize(event.detail))}
			</div>
			<div className={styles.memo}>
				<TiPencil width={18} color="rgba(130, 130, 130, 1)" />
				<span>메모하기</span>
			</div>
		</div>
	);
};

export default DetailView;
