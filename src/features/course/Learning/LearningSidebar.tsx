import React, { useState } from "react";

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
}> = ({ sections, lecturesMap, currentLectureId, onSelectLecture }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Sắp xếp section theo position tăng dần
  const sortedSections = [...sections].sort((a, b) => a.position - b.position);

  return (
    <aside className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white border-l z-30">
      <h2 className="font-bold mb-4 text-lg border-b px-4 pb-2">Nội dung khóa học</h2>
      <div className="overflow-y-auto h-[calc(100vh-4rem-3.5rem)] pr-2 bg-gray-50">
        {sortedSections.map(section => (
          <div key={section.sectionId} className="mb-4 border-b pb-2">
            <button
              className="w-full text-left font-semibold flex justify-between items-center py-2 px-4"
              onClick={() =>
                setOpenSection(openSection === section.sectionId ? null : section.sectionId)
              }
            >
              <span>{section.title}</span>
              <span>
                {openSection === section.sectionId ? "▲" : "▼"}
              </span>
            </button>
            {openSection === section.sectionId && (
              <ul className="mt-2">
                {(lecturesMap[section.sectionId] || [])
                  .slice()
                  .sort((a, b) => a.position - b.position)
                  .map(lecture => (
                    <li
                      key={lecture.lectureId}
                      className={`cursor-pointer px-2 py-1 px-5 rounded ${lecture.lectureId === currentLectureId
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
        ))}
      </div>
    </aside>
  );
};

export default LearningSidebar; 