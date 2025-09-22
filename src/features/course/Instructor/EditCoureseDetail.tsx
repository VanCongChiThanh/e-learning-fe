import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosAuth from "../../../api/axiosAuth";

const EditCourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [sections, setSections] = useState<any[]>([]);
  const [lecturesMap, setLecturesMap] = useState<Record<string, any[]>>({});
  const [selectedLecture, setSelectedLecture] = useState<any>(null);

  useEffect(() => {
    async function fetchSections() {
      const res = await axiosAuth.get(`/courses/${courseId}/sections`);
      setSections(res.data.data);

      const lecturesObj: Record<string, any[]> = {};
      for (const section of res.data.data) {
        const lecturesRes = await axiosAuth.get(`/sections/${section.sectionId}/lectures`);
        lecturesObj[section.sectionId] = lecturesRes.data.data;
      }
      setLecturesMap(lecturesObj);
    }
    if (courseId) fetchSections();
  }, [courseId]);

  const handleLectureClick = async (lectureId: string) => {
    const res = await axiosAuth.get(`/sections/lectures/${lectureId}`);
    setSelectedLecture(res.data.data);
  };

  const handleEditLecture = (lectureId: string) => {
    navigate(`/instructor/lectures/${lectureId}/edit`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Chỉnh sửa chi tiết khóa học</h2>
      {sections.map(section => (
        <div key={section.sectionId} className="mb-6 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between px-4 py-2 font-semibold bg-gray-100 rounded-t-lg">
            <span>{section.title}</span>
            <button
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={() => navigate(`/instructor/lectures/${section.sectionId}/edit`)}
            >
              Chỉnh sửa section
            </button>
          </div>
          <ul>
            {(lecturesMap[section.sectionId] || []).map(lecture => (
              <li
                key={lecture.lectureId}
                className="flex items-center justify-between px-4 py-2 border-b hover:bg-purple-50 cursor-pointer"
                onClick={() => handleLectureClick(lecture.lectureId)}
              >
                <span>{lecture.title}</span>
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={e => {
                    e.stopPropagation();
                    handleEditLecture(lecture.lectureId);
                  }}
                >
                  Chỉnh sửa bài giảng
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Hiển thị chi tiết lecture khi chọn */}
      {selectedLecture && (
        <div className="mt-8 p-4 border rounded bg-white">
          <h3 className="font-bold text-lg mb-2">{selectedLecture.title}</h3>
          <div className="mb-2">Mô tả: {selectedLecture.description || "Chưa có mô tả"}</div>
          <div className="mb-2">Thời lượng: {selectedLecture.duration || "?"} phút</div>
          <div className="mb-2">Video: {selectedLecture.videoUrl ? <a href={selectedLecture.videoUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">Xem video</a> : "Chưa có video"}</div>
        </div>
      )}
    </div>
  );
};

export default EditCourseDetail;