import { useEffect, useState } from "react";
import { getCourseByListId } from "../api";

interface Props {
  section_title: string;
  description: string;
  course_ids: string[];
}

const CareerSectionCard = ({ section_title, description, course_ids }: Props) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false); // ngăn fetch lại

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (!expanded || loadedOnce || !course_ids.length) return;

    setLoading(true);
    // getCourseByListId(course_ids)
    //   .then((res) => setCourses(res.data))
    //   .finally(() => {
    //     setLoadedOnce(true);
    //     setLoading(false);
    //   });
  }, [expanded, course_ids, loadedOnce]);

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-6 hover:shadow-md transition mb-8">
      {/* Header */}
      <div
        onClick={toggleExpand}
        className="flex items-start gap-3 cursor-pointer group"
      >
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">
          📌
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-emerald-700 transition">
            {section_title}
          </h3>
          <p className="text-gray-600 mt-1 leading-relaxed">{description}</p>
        </div>

        {/* Icon dropdown */}
        <div className="text-2xl text-gray-400 group-hover:text-gray-600 transition">
          {expanded ? "▾" : "▸"}
        </div>
      </div>

      {/* Dropdown content */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          expanded ? "max-h-[2000px] mt-4" : "max-h-0"
        }`}
      >
        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 text-emerald-600 font-medium py-3">
            <div className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
            Đang tải danh sách khóa học...
          </div>
        )}

        {/* Course list */}
        {!loading && courses.length > 0 && (
          <div className="space-y-4 mt-2">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="flex gap-4 p-4 rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer bg-white group"
              >
                <img
                  className="w-20 h-20 rounded-lg object-cover"
                  src={course.image || "https://placehold.co/400x225?text=Course"}
                  alt={course.title}
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-lg group-hover:text-emerald-600 transition">
                    {course.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{course.level}</p>
                </div>
                <button className="px-4 py-2 rounded-lg border bg-gray-50 hover:bg-emerald-600 hover:text-white transition font-medium">
                  Xem khóa
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Trường hợp không có khóa */}
        {!loading && loadedOnce && courses.length === 0 && (
          <p className="text-gray-500 py-3">Không tìm thấy khóa học phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default CareerSectionCard;
