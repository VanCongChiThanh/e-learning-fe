import React, { useEffect, useState } from "react";

interface Section {
  sectionId: string;
  title: string;
  position: number;
}

interface Lecture {
  lectureId: string;
  title: string;
  position: number;
}

const LearningSidebar: React.FC<{
  sections: Section[];
  lecturesMap: Record<string, Lecture[]>;
  currentLectureId?: string;
  onSelectLecture: (lectureId: string) => void;
  onToggleSection: (sectionId: string) => void;
  loadingSections: Set<string>;
}> = ({ sections, lecturesMap, currentLectureId, onSelectLecture, onToggleSection, loadingSections }) => {
  const [openSectionId, setOpenSectionId] = useState<string | null>(sections.length > 0 ? sections[0].sectionId : null);
  // Tự động mở section đầu tiên khi component được render
  useEffect(() => {
    if (sections.length > 0 && !openSectionId) {
      setOpenSectionId(sections[0].sectionId);
    }
  }, [sections, openSectionId]);
  // Sắp xếp section theo position tăng dần
  const sortedSections = [...sections].sort((a, b) => a.position - b.position);
  
  return (
    <aside className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white border-l z-30">
      <h2 className="font-bold mb-4 text-lg border-b px-4 pb-2">Nội dung khóa học</h2>
      <div className="overflow-y-auto h-[calc(100vh-4rem-3.5rem)] pr-2 bg-gray-50">
        {sections.map(section => (
          <div key={section.sectionId} className="mb-4 border-b pb-2">
            <button
              className="w-full text-left font-semibold flex justify-between items-center py-2 px-4"
              onClick={() => {
                // Gọi hàm để trigger việc tải dữ liệu
                onToggleSection(section.sectionId);
                // Mở hoặc đóng section
                setOpenSectionId(openSectionId === section.sectionId ? null : section.sectionId);
              }}
            >
              <span>{section.title}</span>
              <span>
                {openSectionId === section.sectionId ? "▲" : "▼"}
              </span>
            </button>
            {openSectionId === section.sectionId && (
              <div className="mt-2">
                {/* Hiển thị loading nếu section này đang tải */}
                {loadingSections.has(section.sectionId) ? (
                  <div className="px-5 py-2 text-gray-500 italic">Đang tải bài giảng...</div>
                ) : (
                  <ul>
                    {(lecturesMap[section.sectionId] || []).map(lecture => (
                      <li
                        key={lecture.lectureId}
                        className={`cursor-pointer px-2 py-1 px-5 rounded ${
                          lecture.lectureId === currentLectureId
                            ? "bg-purple-100 font-bold"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => onSelectLecture(lecture.lectureId)}
                      >
                        {lecture.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LearningSidebar; 