import { addBookmark, removeBookmark } from "@api/user";
import { useEvents } from "@contexts/EventContext";
import { useEffect, useState, useRef } from "react";
import styles from "@styles/DetailView.module.css";
import { formatDateDotParsed } from "@calendarUtil/dateFormatter";
import { getDDay } from "../util/Calendar/getDday";
import { CATEGORY_COLORS, CATEGORY_LIST } from "@constants";
import { FaAnglesRight } from "react-icons/fa6";
import { TiPencil } from "react-icons/ti";
import type { EventDetail } from "@types";
import DOMPurify from "isomorphic-dompurify";
import parse from "html-react-parser";

// ✅ TODO: 연동
// import { useUserData } from "@contexts/UserDataContext";

const DetailView = ({
	eventId,
	onClose,
}: {
	eventId: number;
	onClose: () => void;
}) => {
	const [event, setEvent] = useState<EventDetail>();
	const { fetchEventById } = useEvents();

	// ✅ TODO: useUserData()에서 함수 가져와서 쓰기
	// const { createMemo, createTag, deleteTag } = useUserData();

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

	// 메모 관련 상태
	const [memo, setMemo] = useState<string>("");
	const [isSavingMemo, setIsSavingMemo] = useState<boolean>(false);
	const [memoError, setMemoError] = useState<string | null>(null);
	const [isMemoExpanded, setIsMemoExpanded] = useState<boolean>(false);

	// 태그 관련 상태
	const [tagNames, setTagNames] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState<string>("");
	const [isSavingTag, setIsSavingTag] = useState(false);
	const [tagError, setTagError] = useState<string | null>(null);

	// 메모 & 태그 input ref
	const memoInputRef = useRef<HTMLTextAreaElement | null>(null);
	const tagInputRef = useRef<HTMLInputElement | null>(null);

	// 태그 관련 함수
	const normalizeTag = (raw: string) => {
		// 공백 제거, # 제거, 연속 공백 정리
		const tag = raw.trim().replace(/^#+/, "");
		return tag;
	};
	useEffect(() => {
		if (event) {
			setIsBookmarked(event.isBookmarked ? event.isBookmarked : false);
		}
	}, [event]);

	useEffect(() => {
		void eventId;

		setMemo("");
		setTagInput("");
		setTagNames([]);
		setMemoError(null);
		setIsSavingMemo(false);
		setIsMemoExpanded(false);
	}, [eventId]);

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

	// 메모 입력 영역 확장 함수
	const expandMemo = () => {
		if (!isMemoExpanded) setIsMemoExpanded(true);
		// 다음 tick에 포커스
		setTimeout(() => memoInputRef.current?.focus(), 0);
	};

	// 태그 추가
	const addTag = (raw?: string) => {
		const candidate = normalizeTag(raw ?? tagInput);
		if (!candidate) return;

		setTagNames((prev) => {
			// 대소문자 무시, 중복 방지
			const exists = prev.some(
				(t) => t.toLowerCase() === candidate.toLowerCase(),
			);
			if (exists) return prev;
			return [...prev, candidate];
		});
		setTagInput("");
		setMemoError(null);
		// 태그 추가 후 계속 입력할 수 있게 유지
		setTimeout(() => tagInputRef.current?.focus(), 0);
	};

	// 태그 삭제
	const removeTag = (tag: string) => {
		setTagNames((prev) => prev.filter((t) => t !== tag));
	};

	// 메모 저장 기능
	const handleMemoSave = async () => {
		setMemoError(null);

		const content = memo.trim();
		if (!content) {
			setMemoError("메모 내용을 입력해주세요.");
			return;
		}

		setIsSavingMemo(true);
		try {
			// ✅ TODO: api 연동 (메모 저장)
			// await createMemo(eventId, content, tagNames);

			// ✅ TODO: api 연동 (태그를 하나씩 저장)
			// const failed: string[] = [];
			// for (const tag of tagNames) {
			//   try {
			//     await createTag(eventId, tag);
			//   } catch (e) {
			//     console.error("Tag create failed:", tag, e);
			//     failed.push(tag);
			//   }
			// }
			// if (failed.length > 0) {
			//   setTagError?.(`${failed.join(", ")} 태그 저장에 실패했어요.`);
			// }

			setMemo("");
			setTagNames([]);
		} catch (error) {
			console.error("메모 저장 실패:", error);
			setMemoError("메모 저장에 실패했습니다. 다시 시도해주세요.");
		} finally {
			setIsSavingMemo(false);
		}
	};

	// 메모 저장 가능 여부 판단
	// const canSaveMemo = useMemo(() => memo.trim().length > 0 && !isSavingMemo, [memo, isSavingMemo]);

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
			{/* ----- Memo & Tag Section ----- */}
			<div className={styles.memo}>
				{/* 헤더 라인 (연필/메모하기/저장하기) */}
				<div className={styles.memoHeader}>
					<button
						type="button"
						onClick={expandMemo}
						className={styles.memoIconBtn}
						aria-label="메모 입력 열기"
					>
						<TiPencil width={18} color="rgba(130, 130, 130, 1)" />
					</button>

					{memo.trim().length > 0 ? (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleMemoSave();
							}}
							className={styles.memoSaveBtn}
							disabled={isSavingMemo}
						>
							{isSavingMemo ? "저장 중..." : "저장하기"}
						</button>
					) : (
						<button
							type="button"
							onClick={expandMemo}
							className={styles.memoTriggerText}
						>
							메모하기
						</button>
					)}
				</div>

				{/* 메모 입력 */}
				<div className={styles.memoBody}>
					{isMemoExpanded ? (
						<textarea
							ref={memoInputRef}
							value={memo}
							onChange={(e) => {
								setMemo(e.target.value);
								setMemoError(null);
							}}
							disabled={isSavingMemo}
							className={styles.memoInput}
							placeholder="메모를 입력하세요"
							rows={4}
						/>
					) : (
						<input
							value={memo}
							onChange={(e) => {
								setMemo(e.target.value);
								setMemoError(null);
							}}
							className={styles.memoInput}
							type="text"
							placeholder="메모를 입력하세요"
							disabled={isSavingMemo}
							onFocus={expandMemo}
							onClick={(e) => {
								e.stopPropagation();
								expandMemo();
							}}
						/>
					)}
				</div>

				{/* 태그 영역: 확장 시만 노출 */}
				{isMemoExpanded ? (
					<div className={styles.tagSection} role="presentation">
						<div className={styles.tagRow}>
							<input
								ref={tagInputRef}
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								placeholder="태그 추가…"
								type="text"
								className={styles.tagInput}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										if (!isSavingTag) addTag();
									}
									if (
										e.key === "Backspace" &&
										tagInput.length === 0 &&
										tagNames.length > 0
									) {
										removeTag(tagNames[tagNames.length - 1]);
									}
								}}
							/>

							<button
								type="button"
								onClick={() => addTag()}
								className={styles.tagAddBtn}
								disabled={isSavingTag || normalizeTag(tagInput).length === 0}
							>
								추가
							</button>
						</div>

						{tagNames.length > 0 ? (
							<div className={styles.tagChips}>
								{tagNames.map((t) => (
									<span key={t} className={styles.tagChip}>
										<span className={styles.tagChipText}>#{t}</span>
										<button
											type="button"
											onClick={() => removeTag(t)}
											className={styles.tagChipRemove}
											aria-label={`remove tag ${t}`}
										>
											×
										</button>
									</span>
								))}
							</div>
						) : (
							<div className={styles.helperText}>
								Enter 또는 “추가”로 태그를 추가할 수 있어요.
							</div>
						)}
					</div>
				) : null}

				{memoError ? <div className={styles.errorText}>{memoError}</div> : null}
				{tagError ? <div className={styles.errorText}>{tagError}</div> : null}
			</div>
		</div>
	);
};

export default DetailView;
