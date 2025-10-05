import { useEffect, useState } from "react";
import { UUID } from "crypto";
import { getAllSections } from "../api/session";
import { getAllLectures } from "../api/lectures";

export interface LectureOption {
    lectureId: UUID;
    title: string;
    sectionTitle: string;
}

export function useLecturesByCourse(courseId?: UUID) {
    const [lectures, setLectures] = useState<LectureOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!courseId) return;

        const fetchLecturesForCourse = async () => {
            setLoading(true);
            try {
                // Lấy danh sách sections (sessions) của course
                const sectionsData = await getAllSections(courseId);
                const allLectures: LectureOption[] = [];

                // Lấy lectures cho từng section
                for (const section of sectionsData.data) {
                    try {
                        const lecturesData = await getAllLectures(section.sectionId);
                        const sectionLectures = lecturesData.data.map((lecture: any) => ({
                            lectureId: lecture.lectureId,
                            title: lecture.title,
                            sectionTitle: section.title,
                        }));
                        allLectures.push(...sectionLectures);
                    } catch (err) {
                        console.warn(`Could not fetch lectures for section ${section.sectionId}:`, err);
                    }
                }

                // Sắp xếp theo section và position
                allLectures.sort((a, b) => a.title.localeCompare(b.title));
                setLectures(allLectures);
            } catch (err: any) {
                setError(err.message || "Error fetching lectures");
            } finally {
                setLoading(false);
            }
        };

        fetchLecturesForCourse();
    }, [courseId]);

    return { lectures, loading, error };
}