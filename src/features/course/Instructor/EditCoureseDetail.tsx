import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosAuth from "../../../api/axiosAuth";
import AddSectionsModal from "./AddSectionsModal";
import EditSectionModal from "./EditSectionModal";
import DeleteSectionModal from "./DeleteSectionModal";
import AddLecturesModal from "./AddLecturesModal";

interface Course {
  courseId: string;
  title: string;
  description: string;
  image: string;
  level: string;
  category: string;
  status: string;
  totalStudents?: number;
  createdAt: number;
}

interface Section {
  sectionId: string;
  title: string;
  position: number;
  description?: string;
}

interface Lecture {
  lectureId: string;
  title: string;
  description?: string;
  duration?: number;
  videoUrl?: string;
  position: number;
}

const EditCourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [lecturesMap, setLecturesMap] = useState<Record<string, Lecture[]>>({});
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [loadingSections, setLoadingSections] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);
  const [showDeleteSectionModal, setShowDeleteSectionModal] = useState(false);
  const [showAddLecturesModal, setShowAddLecturesModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch course info
        const courseRes = await axiosAuth.get(`/courses/${courseId}`);
        setCourse(courseRes.data.data);

        // Fetch sections only
        const sectionsRes = await axiosAuth.get(`/courses/${courseId}/sections`);
        setSections(sectionsRes.data.data.sort((a: Section, b: Section) => a.position - b.position));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    if (courseId) fetchData();
  }, [courseId]);

  const toggleSection = async (sectionId: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });

    // Nếu section chưa có lectures, thì load
    if (!lecturesMap[sectionId]) {
      setLoadingSections(prev => new Set(prev).add(sectionId));

      try {
        const lecturesRes = await axiosAuth.get(`/sections/${sectionId}/lectures`);
        setLecturesMap(prev => ({
          ...prev,
          [sectionId]: lecturesRes.data.data.sort(
            (a: Lecture, b: Lecture) => a.position - b.position
          ),
        }));
      } catch (error) {
        console.error("Error fetching lectures:", error);
      } finally {
        setLoadingSections(prev => {
          const newSet = new Set(prev);
          newSet.delete(sectionId);
          return newSet;
        });
      }
    }
  };

  const handleSectionsAdded = async () => {
    // Reload sections after adding new ones
    try {
      const sectionsRes = await axiosAuth.get(`/courses/${courseId}/sections`);
      setSections(sectionsRes.data.data.sort((a: Section, b: Section) => a.position - b.position));
    } catch (error) {
      console.error("Error reloading sections:", error);
    }
  };

  const handleEditSection = (section: Section) => {
    setSelectedSection(section);
    setShowEditSectionModal(true);
  };

  const handleDeleteSection = (section: Section) => {
    setSelectedSection(section);
    setShowDeleteSectionModal(true);
  };

  const handleSectionUpdated = async () => {
    // Reload sections after update
    try {
      const sectionsRes = await axiosAuth.get(`/courses/${courseId}/sections`);
      setSections(sectionsRes.data.data.sort((a: Section, b: Section) => a.position - b.position));
    } catch (error) {
      console.error("Error reloading sections:", error);
    }
  };

  const handleSectionDeleted = async () => {
    // Reload sections and re-sync positions
    try {
      const sectionsRes = await axiosAuth.get(`/courses/${courseId}/sections`);
      const fetchedSections = sectionsRes.data.data.sort((a: Section, b: Section) => a.position - b.position);
      
      // Check if positions need to be updated
      const needsPositionUpdate = fetchedSections.some(
        (section: Section, index: number) => section.position !== index
      );

      if (needsPositionUpdate) {
        // Update positions for all sections
        const updatePromises = fetchedSections.map((section: Section, index: number) => {
          if (section.position !== index) {
            return axiosAuth.put(`/courses/sections/${section.sectionId}`, {
              title: section.title,
              description: section.description || "",
            });
          }
          return Promise.resolve();
        });

        await Promise.all(updatePromises);
        
        // Reload again after position updates
        const updatedSectionsRes = await axiosAuth.get(`/courses/${courseId}/sections`);
        setSections(updatedSectionsRes.data.data.sort((a: Section, b: Section) => a.position - b.position));
      } else {
        setSections(fetchedSections);
      }
    } catch (error) {
      console.error("Error handling section deletion:", error);
    }
  };

  const handleAddLectures = (section: Section) => {
    setSelectedSection(section);
    setShowAddLecturesModal(true);
  };

  const handleLecturesAdded = async () => {
    // Reload lectures for the selected section
    if (selectedSection) {
      try {
        const lecturesRes = await axiosAuth.get(`/sections/${selectedSection.sectionId}/lectures`);
        setLecturesMap(prev => ({
          ...prev,
          [selectedSection.sectionId]: lecturesRes.data.data.sort(
            (a: Lecture, b: Lecture) => a.position - b.position
          ),
        }));
        // Ensure section is open to show new lectures
        setOpenSections(prev => new Set(prev).add(selectedSection.sectionId));
      } catch (error) {
        console.error("Error reloading lectures:", error);
      }
    }
  };


  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER": return "bg-green-100 text-green-800";
      case "INTERMEDIATE": return "bg-yellow-100 text-yellow-800";
      case "ADVANCED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "DEVELOPMENT": return "bg-blue-100 text-blue-800";
      case "BUSINESS": return "bg-purple-100 text-purple-800";
      case "DESIGN": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <i className="fas fa-exclamation-triangle text-6xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-600">Không tìm thấy khóa học</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#106c54] to-[#0d5a45] text-white rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img
                src={course.image}
                alt={course.title}
                className="w-20 h-20 rounded-lg object-cover shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-green-100 mb-3">{course.description}</p>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)} bg-white`}>
                    {course.level}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)} bg-white`}>
                    {course.category}
                  </span>
                  <span className="text-indigo-100">
                    <i className="fas fa-users mr-1"></i>
                    {course.totalStudents || 0} học viên
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/instructor/courses/${courseId}/edit`)}
                className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-[#106c54] transition-colors flex items-center gap-2"
              >
                <i className="fas fa-arrow-left"></i>
                Quay lại
              </button>
              <button 
                onClick={() => setShowAddSectionModal(true)}
                className="bg-white text-[#106c54] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Thêm Section
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-chart-bar text-[#106c54]"></i>
                Thống kê khóa học
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng Section:</span>
                  <span className="font-semibold text-[#106c54]">{sections.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng Bài giảng:</span>
                  <span className="font-semibold text-[#106c54]">
                    {Object.values(lecturesMap).reduce((total, lectures) => total + lectures.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </div>
              </div>

              <hr className="my-6" />

              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <i className="fas fa-plus-circle text-[#106c54]"></i>
                  <span>Thêm Section mới</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <i className="fas fa-sort text-[#106c54]"></i>
                  <span>Sắp xếp Section</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <i className="fas fa-eye text-[#106c54]"></i>
                  <span>Xem trước khóa học</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sections Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <i className="fas fa-list text-[#106c54]"></i>
                  Nội dung khóa học ({sections.length} section)
                </h2>
                <p className="text-gray-600 mt-1">Quản lý và chỉnh sửa các section và bài giảng</p>
              </div>

              <div className="divide-y">
                {sections.map((section, index) => (
                  <div key={section.sectionId} className="p-6">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-semibold text-[#106c54]">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                          {section.description && (
                            <p className="text-gray-600 text-sm mt-1">{section.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {lecturesMap[section.sectionId]?.length || 0} bài giảng
                        </span>
                        <button
                          onClick={() => toggleSection(section.sectionId)}
                          className="p-2 text-gray-400 hover:text-[#106c54] hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <i className={`fas fa-chevron-${openSections.has(section.sectionId) ? 'up' : 'down'}`}></i>
                        </button>
                        <button 
                          onClick={() => handleEditSection(section)}
                          className="p-2 text-gray-400 hover:text-[#106c54] hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteSection(section)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    {/* Section Actions */}
                    <div className="flex gap-2 mb-4">
                      <button 
                        onClick={() => handleAddLectures(section)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors flex items-center gap-1"
                      >
                        <i className="fas fa-plus text-xs"></i>
                        Thêm bài giảng
                      </button>
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors flex items-center gap-1">
                        <i className="fas fa-plus text-xs"></i>
                        Thêm quiz
                      </button>
                    </div>

                    {/* Lectures List */}
                    {openSections.has(section.sectionId) && (
                      <div className="border-l-2 border-green-100 ml-4 pl-6">
                        {loadingSections.has(section.sectionId) ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#106c54]"></div>
                            <span className="ml-2 text-gray-600">Đang tải bài giảng...</span>
                          </div>
                        ) : lecturesMap[section.sectionId]?.length > 0 ? (
                          <div className="space-y-3">
                            {lecturesMap[section.sectionId].map((lecture, lectureIndex) => (
                              <div
                                key={lecture.lectureId}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                                    {lectureIndex + 1}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <i className={`fas ${lecture.videoUrl ? 'fa-play-circle text-green-600' : 'fa-file-alt text-gray-400'} text-sm`}></i>
                                    <span className="font-medium text-gray-900">{lecture.title}</span>
                                  </div>
                                  {lecture.duration && (
                                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                      {lecture.duration} phút
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/instructor/lectures/${lecture.lectureId}/edit`);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Chỉnh sửa bài giảng"
                                  >
                                    <i className="fas fa-edit text-sm"></i>
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <i className="fas fa-trash text-sm"></i>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <i className="fas fa-plus-circle text-2xl mb-2 block"></i>
                            <p>Chưa có bài giảng nào trong section này</p>
                            <button className="mt-2 text-[#106c54] hover:text-[#0d5a45] font-medium">
                              Thêm bài giảng đầu tiên
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {sections.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <i className="fas fa-list text-6xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có section nào</h3>
                    <p className="text-gray-500 mb-6">Bắt đầu tạo section đầu tiên cho khóa học của bạn</p>
                    <button 
                      onClick={() => setShowAddSectionModal(true)}
                      className="bg-[#106c54] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0d5a45] transition-colors"
                    >
                      Tạo section đầu tiên
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Sections Modal */}
        <AddSectionsModal
          isOpen={showAddSectionModal}
          onClose={() => setShowAddSectionModal(false)}
          courseId={courseId || ""}
          currentSectionsCount={sections.length}
          onSuccess={handleSectionsAdded}
        />

        {/* Edit Section Modal */}
        <EditSectionModal
          isOpen={showEditSectionModal}
          onClose={() => {
            setShowEditSectionModal(false);
            setSelectedSection(null);
          }}
          section={selectedSection ? {
            sectionId: selectedSection.sectionId,
            title: selectedSection.title,
            description: selectedSection.description || ""
          } : null}
          onSuccess={handleSectionUpdated}
        />

        {/* Delete Section Modal */}
        <DeleteSectionModal
          isOpen={showDeleteSectionModal}
          onClose={() => {
            setShowDeleteSectionModal(false);
            setSelectedSection(null);
          }}
          section={selectedSection ? {
            sectionId: selectedSection.sectionId,
            title: selectedSection.title,
            position: selectedSection.position
          } : null}
          totalSections={sections.length}
          onSuccess={handleSectionDeleted}
        />

        {/* Add Lectures Modal */}
        <AddLecturesModal
          isOpen={showAddLecturesModal}
          onClose={() => {
            setShowAddLecturesModal(false);
            setSelectedSection(null);
          }}
          sectionId={selectedSection?.sectionId || ""}
          sectionTitle={selectedSection?.title || ""}
          currentLecturesCount={selectedSection ? (lecturesMap[selectedSection.sectionId]?.length || 0) : 0}
          onSuccess={handleLecturesAdded}
        />
      </div>
    </div>
  );
};

export default EditCourseDetail;