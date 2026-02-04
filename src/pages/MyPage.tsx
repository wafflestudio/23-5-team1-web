import { useAuth } from "@/contexts/AuthProvider"
import Navigationbar from "@/widgets/Navigationbar"
import styles from "@styles/MyPage.module.css"
import { BookmarkWidget } from "./bookmark/Bookmark"
import { MemoWidget } from "./memo/Memo"
import { FaChevronRight } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import { useTimetable } from "@/contexts/TimetableContext"

const ProfileCard = () => {
    const { user } = useAuth();
    const { timetables } = useTimetable();
    const navigate = useNavigate();

    return (
            <div className={styles.profileContainer}>
                <div className={styles.profileRow}>
                    <img src={user?.profileImageUrl} alt="profile img" />
                    <div className={styles.nameEmailCol}>
                        <span className={styles.nameText}>{user?.username}</span>
                        <span className={styles.emailText}>{user?.email}</span>
                    </div>
                    <FaChevronRight className={styles.backBtn} color="ABABAB" size={18} onClick={()=>navigate('/my/profile')} />
                </div>
                <button type='button' className={styles.timeTableBtn} onClick={() => navigate('/timetable')}>
                    {timetables && timetables.length > 0 ? 
                    <>
                        <img src="/assets/radio.svg" alt="a plus button" />
                        <span>내 시간표 등록하기</span>
                    </>
                    :
                    <>
                        <img src="/assets/timetableActive.png" alt="a colored timetable icon" />
                        <span>내 시간표 수정하기</span>
                    </>
                    }
                </button>
            </div>
    )
}

const MyPage = () => {
    const { user } = useAuth();

    return (
        <main>
            <Navigationbar />
            {user ? 
            <div className={styles.mypageContainer}>
                <ProfileCard />
                <div className={styles.widgetsWrapper}>
                    <BookmarkWidget />
                    <MemoWidget />
                </div>
            </div>
            : 
            <div className={styles.notFound}>
                {/* Login modal */}    
            </div>   
            }
        </main>
    )
}

export default MyPage