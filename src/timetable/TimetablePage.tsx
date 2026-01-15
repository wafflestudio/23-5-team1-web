// 시간 정보 -> UTC 시간으로 변환. Date 객체 활용

import { useMemo, useState } from "react";
import type { Course, TimeSlot } from "../util/types";
import { WeekGrid } from "./WeekGrid";
import { AddClassPanel } from "./AddClassPanel";
import { hasOverlap, type GridConfig } from "./layout";
import "./timetable.css";

export default function TimetablePage() {
    const [course, setCourse] = useState<Course[]>([
        {
            id: 110,
            courseTitle: "통계학",
            year: 2025,
            semester: "SPRING",
            slot: [
                { day: 1, startMin: 11 * 60, endMin: 12 * 60 + 30 },
                { day: 3, startMin: 11 * 60, endMin: 12 * 60 + 30 },
            ],
        },
    ]); 

    const config: GridConfig = useMemo(
        () => ({
            startHour: 7,
            endHour: 25,
            ppm: 0.9,
        }),
        []
    );

    const allSlots: TimeSlot[] = useMemo(
        () => course.flatMap((c) => c.slot),
        [course]
    );

    const addCourse = (item: Course) => {
        item.slot.forEach(time => {
            if(hasOverlap(allSlots, time)) {
            alert("겹치는 수업은 추가할 수 없습니다. ")
            return;
            }
        setCourse((prev) => [...prev, item]);
        });
    }

    // 시간 설정 관련 논의 필요
    const now = new Date();

    return (
        <div>
            <div>
                {/* 필터 페이지 바 영역 */}
            </div>

            <main>
                <div>
                    <h1>{now.getFullYear()}년 {now.getMonth() + 1}월 {now.getDate()}일</h1>
                    <div className="tt-topbarRight">
                        {/* 월/주/일 토글, 검색, 아이콘 자리 */}
                    </div>
                </div>

                <div>
                    <WeekGrid courses={course} config={config} />
                </div>
            </main>

            <AddClassPanel onAdd={addCourse} existingSlots={allSlots} />
        </div>

    )
}