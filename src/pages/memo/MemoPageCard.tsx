import { formatDateDotParsed } from "@/util/Calendar/dateFormatter";
import type { Memo } from "@/util/types";
import { useState } from "react";

import styles from '@styles/MemoPageCard.module.css';
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoMdDoneAll } from "react-icons/io";

const MemoPageCard = ({ memo }: { memo: Memo }) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [content, setContent] = useState<string>(memo.content);
    
    return (
        <div className={styles.cardContainer}>
            <span className={styles.memoDate}>{formatDateDotParsed(memo.createdAt)}</span>
            <div className={styles.cardWrapper}>
                <textarea 
                    className={`${styles.memoTextarea} ${editMode ? styles.activeTextarea : ''}`}
                    value={content}
                    onChange={(e)=>setContent(e.currentTarget.value)}
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

export default MemoPageCard;