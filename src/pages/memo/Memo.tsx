import { useUserData } from "@/contexts/UserDataContext";
import styles from '@styles/Memo.module.css';
import type { Memo } from "@/util/types";
import { formatDateDotParsed } from "@/util/Calendar/dateFormatter";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoMdDoneAll } from "react-icons/io";
import Navigationbar from "@/widgets/Navigationbar";
import { useNavigate } from "react-router-dom";

const MemoWidgetCard = ({ memo }: { memo: Memo }) => {
    return (
        <div className={styles.cardWrapper}>
            <span className={styles.memoContent}>{memo.content}</span>
            <span className={styles.memoTitle}>{memo.eventTitle}</span>
            <span className={styles.memoDate}>{formatDateDotParsed(memo.createdAt)}</span>
            <ul className={styles.chips}>
                {memo.tags.map(t => <li key={t.id} className={styles.chip}>{t.content}</li>)}
            </ul>
        </div>
    )
}

const MemoPageCard = ({ memo }: { memo: Memo }) => {
    const [editMode, setEditMode] = useState<boolean>(false);

    return (
        <div className={styles.cardContainer}>
            <span className={styles.memoDate}>{formatDateDotParsed(memo.createdAt)}</span>
            <div className={styles.cardWrapper}>
                <textarea 
                    className={`${styles.memoTextarea} ${editMode ? styles.activeTextarea : ''}`}
                    value={styles.memoText}
                    disabled={!editMode}
                />
                <span className={styles.memoTitle}>{memo.eventTitle}</span>
                <ul className={styles.chips}>
                    {memo.tags.map(t => <li key={t.id} className={styles.chip}>{t.content}</li>)}
                </ul>
                {!editMode ? <HiOutlinePencilAlt onClick={()=>setEditMode(true)} className={styles.editIcon} size={20} color="ABABAB" /> : <IoMdDoneAll onClick={()=>{setEditMode(false) /* TODO : Send PATCH request */}} className={styles.editIcon} size={20} color="ABABAB" />}
            </div>
        </div>
    )
}

export const MemoWidget = () => {
    const { eventMemos } = useUserData();
    const navigate = useNavigate();
    return (
        <div className={styles.memosContainer}>
            <div className={styles.memosHeader}>
                <div className={styles.memosLeft}>
                    <span>내 메모 목록</span>
                    <img src="/assets/pencil.svg" alt="pencil icon" />
                </div>
                <FaChevronRight className={styles.backBtn} color="ABABAB" size={18} onClick={()=>navigate('/my/memo')} />
            </div>
            <div className={styles.cardsRow}>
                {eventMemos.map((m: Memo) => (
                    <MemoWidgetCard key={m.id} memo={m} />
                ))}
            </div>
            {(!eventMemos || eventMemos.length===0) && <span className={styles.noneText}>{`아직 메모가 없습니다.\n다녀온 행사나 관심있는 행사에 대한 메모를 작성해보세요!`}</span>}
        </div>
    )
};

const MemoPage = () => {
    const { eventMemos } = useUserData();
    const navigate = useNavigate();

    return (
        <main>
            <div className={styles.memosPage}>
                <Navigationbar />
                <div className={styles.memosHeader}>
                    <FaChevronLeft className={styles.backBtn} color="ABABAB" size={18} onClick={()=>navigate('/my')} />
                    <div className={styles.row}>
                        <span>내 메모 목록</span>
                        <img src="/assets/pencil.svg" alt="pencil icon" />
                    </div>
                </div>
                <div className={styles.cardsColumn}>
                    {eventMemos.map((m: Memo) => (
                        <MemoPageCard memo={m} key={m.id} />
                    ))}
                </div>
                {(!eventMemos || eventMemos.length===0) && <span className={styles.noneText}>{`아직 메모가 없습니다.\n다녀온 행사나 관심있는 행사에 대한 메모를 작성해보세요!`}</span>}
            </div>
        </main>
    )
}

export default MemoPage;