import React, { useState, useEffect } from 'react';
import { UUID } from 'crypto';
import { QuizCard } from '../component/QuizCard';
import { AssignmentCard } from '../component/AssignmentCard';
import { QuizFormModal, AssignmentFormModal } from '../component/QuizAssignmentModals';
import { QuizQuestionManager } from '../component/QuizQuestionManager';
import { StatsCard } from '../common/Progress';
import { useQuizzesByLecture } from '../hook/useQuiz';
import { useAssignmentsByCourse } from '../hook/useAssignment';
import { useQuizStats, useAssignmentStats } from '../hook/useQuizAssignmentStats';
import { useInstructorCourses } from '../hook/useInstructorManager';
import { useSessionsByCourse } from '../hook/useSession';
import { useLecturesBySession } from '../hook/useSession';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
export const QuizAssignmentInstructor: React.FC = ({ }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const instructorId = user?.id as UUID;
  const [selectedCourseId, setSelectedCourseId] = useState<UUID | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<UUID | null>(null);
  const [selectedLectureId, setSelectedLectureId] = useState<UUID | null>(null);
  const [activeTab, setActiveTab] = useState<'quiz' | 'assignment'>('quiz');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isQuizQuestionModalOpen, setIsQuizQuestionModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [selectedQuizForQuestions, setSelectedQuizForQuestions] = useState<UUID | null>(null);
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useInstructorCourses(instructorId);

  // Use hooks for sessions and lectures
  const { sessions, loading: sessionsLoading, error: sessionsError } = useSessionsByCourse(selectedCourseId || undefined);
  const { lectures, loading: lecturesLoading, error: lecturesError } = useLecturesBySession(selectedSessionId || undefined);

  // Use hooks for quizzes and assignments
  const { 
    quizzes, 
    loading: quizzesLoading, 
    error: quizzesError, 
    addQuiz, 
    updateQuizById, 
    removeQuiz 
  } = useQuizzesByLecture(selectedLectureId || undefined);
  
  const { 
    assignments, 
    loading: assignmentsLoading, 
    error: assignmentsError, 
    addAssignment, 
    updateAssignmentById, 
    removeAssignment 
  } = useAssignmentsByCourse(selectedCourseId || undefined);

  // Use hooks for stats
  const { quizStats, loading: quizStatsLoading } = useQuizStats(quizzes);
  const { assignmentStats, loading: assignmentStatsLoading } = useAssignmentStats(assignments);

  const loading = quizzesLoading || assignmentsLoading || quizStatsLoading || assignmentStatsLoading;

  // Reset selections when course changes
  useEffect(() => {
    if (selectedCourseId) {
      setSelectedSessionId(null);
      setSelectedLectureId(null);
    }
  }, [selectedCourseId]);

  // Reset lecture selection when session changes
  useEffect(() => {
    if (selectedSessionId) {
      setSelectedLectureId(null);
    }
  }, [selectedSessionId]);

  const handleCreateQuiz = async (data: { 
    lectureId?: UUID; 
    title: string; 
    description?: string;
    maxAttempts: number;
    passingScore: number;
    timeLimitMinutes: number;
    numberQuizQuestions: number;
  }) => {
    if (!selectedCourseId || !selectedSessionId || !selectedLectureId) {
      alert('Vui lòng chọn đầy đủ khóa học, chương và bài giảng trước khi tạo quiz');
      return;
    }
    
    try {
      await addQuiz({
        ...data,
        lectureId: selectedLectureId
      });
      alert('Tạo quiz thành công!');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Có lỗi xảy ra khi tạo quiz');
    }
  };

  const handleEditQuiz = (quizId: UUID) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz) {
      setEditingQuiz(quiz);
      setIsQuizModalOpen(true);
    }
  };

  const handleUpdateQuiz = async (data: { 
    lectureId?: UUID; 
    title: string; 
    description?: string;
    maxAttempts: number;
    passingScore: number;
    timeLimitMinutes: number;
    numberQuizQuestions: number;
  }) => {
    if (!editingQuiz) return;
    
    try {
      // Chỉ gửi các field thực sự thay đổi
      const updateData: any = {};
      
      if (data.title !== editingQuiz.title) {
        updateData.title = data.title;
      }
      
      if (data.description !== editingQuiz.description) {
        updateData.description = data.description;
      }
      
      if (data.maxAttempts !== editingQuiz.maxAttempts) {
        updateData.maxAttempts = data.maxAttempts;
      }
      
      if (data.passingScore !== editingQuiz.passingScore) {
        updateData.passingScore = data.passingScore;
      }
      
      if (data.timeLimitMinutes !== editingQuiz.timeLimitMinutes) {
        updateData.timeLimitMinutes = data.timeLimitMinutes;
      }
      
      if (data.numberQuizQuestions !== editingQuiz.numberQuizQuestions) {
        updateData.numberQuizQuestions = data.numberQuizQuestions;
      }
      
      // Nếu không có gì thay đổi
      if (Object.keys(updateData).length === 0) {
        alert('Không có thay đổi nào để cập nhật');
        return;
      }
      
      await updateQuizById(editingQuiz.id, updateData);
      setEditingQuiz(null);
      alert('Cập nhật quiz thành công!');
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Có lỗi xảy ra khi cập nhật quiz');
    }
  };

  const handleDeleteQuiz = async (quizId: UUID) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa quiz này?')) return;
    
    try {
      await removeQuiz(quizId);
      alert('Xóa quiz thành công!');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Có lỗi xảy ra khi xóa quiz');
    }
  };

  const handleManageQuestions = (quizId: UUID) => {
    setSelectedQuizForQuestions(quizId);
    setIsQuizQuestionModalOpen(true);
  };

  const handleCreateAssignment = async (data: { courseId?: UUID; title: string; description?: string; dueDate?: string }) => {
  if (!selectedCourseId) {
    alert('Vui lòng chọn khóa học trước khi tạo bài tập');
    return;
  }

  try {
    let formattedDueDate: string | undefined = undefined;

    if (data.dueDate) {
      formattedDueDate = new Date(data.dueDate).toISOString();
    }

    await addAssignment({
      ...data,
      courseId: selectedCourseId,
      dueDate: formattedDueDate,
    });

    alert('Tạo bài tập thành công!');
  } catch (error) {
    console.error('Error creating assignment:', error);
    alert('Có lỗi xảy ra khi tạo bài tập: ' + ((error as any)?.message || 'Unknown error'));
  }
};


  const handleEditAssignment = async (data: { courseId?: UUID; title: string; description?: string; dueDate?: string }) => {
    if (!editingAssignment) return;

    try {
      // Chỉ gửi các field thực sự thay đổi
      const updateData: any = {};
      
      if (data.title !== editingAssignment.title) {
        updateData.title = data.title;
      }
      
      if (data.description !== editingAssignment.description) {
        updateData.description = data.description;
      }
      
      // Xử lý dueDate
      if (data.dueDate) {
        const formattedDueDate = new Date(data.dueDate).toISOString();
        if (formattedDueDate !== editingAssignment.dueDate) {
          updateData.dueDate = formattedDueDate;
        }
      } else if (editingAssignment.dueDate) {
        // Nếu cũ có dueDate nhưng giờ xóa đi
        updateData.dueDate = null;
      }
      
      // Nếu không có gì thay đổi
      if (Object.keys(updateData).length === 0) {
        alert('Không có thay đổi nào để cập nhật');
        return;
      }
      
      await updateAssignmentById(editingAssignment.id, updateData);
      setEditingAssignment(null);
      alert('Cập nhật bài tập thành công!');
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Có lỗi xảy ra khi cập nhật bài tập');
    }
  };


  const handleDeleteAssignment = async (assignmentId: UUID) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài tập này?')) return;
    
    try {
      await removeAssignment(assignmentId);
      alert('Xóa bài tập thành công!');
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Có lỗi xảy ra khi xóa bài tập');
    }
  };

  const handleViewQuizStats = (quizId: UUID) => {
    console.log('View quiz stats for:', quizId);
  };

  const handleViewAssignmentSubmissions = (assignmentId: UUID) => {
    console.log('View assignment submissions for:', assignmentId);
  };
  console.log(assignments)
  const totalQuizzes = quizzes.length;
  const totalAssignments = assignments.length;
  const totalQuizAttempts = Object.values(quizStats).reduce((sum: number, stat: any) => sum + (stat.totalAttempts || 0), 0);
  const totalSubmissions = Object.values(assignmentStats).reduce((sum: number, stat: any) => sum + (stat.totalSubmissions || 0), 0);
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý Quiz & Bài Tập</h1>
          
          {/* Course, Session and Lecture Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn khóa học
              </label>
              <select
                value={selectedCourseId || ''}
                onChange={(e) => setSelectedCourseId(e.target.value as UUID)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                disabled={coursesLoading}
              >
                <option value="">-- Chọn khóa học --</option>
                {courses?.map((course: any) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn chương
              </label>
              <select
                value={selectedSessionId || ''}
                onChange={(e) => setSelectedSessionId(e.target.value as UUID)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                disabled={!selectedCourseId || sessionsLoading}
              >
                <option value="">-- Chọn chương --</option>
                {sessions?.map((session: any) => (
                  <option key={session.sectionId} value={session.sectionId}>
                    {session.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn bài giảng
              </label>
              <select
                value={selectedLectureId || ''}
                onChange={(e) => setSelectedLectureId(e.target.value as UUID)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                disabled={!selectedSessionId || lecturesLoading}
              >
                <option value="">-- Chọn bài giảng --</option>
                {lectures?.map((lecture: any) => (
                  <option key={lecture.lectureId} value={lecture.lectureId}>
                    {lecture.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Tổng Quiz"
              value={totalQuizzes}
              color="#106c54"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatsCard
              title="Tổng Bài Tập"
              value={totalAssignments}
              color="#2563eb"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              }
            />
            <StatsCard
              title="Lượt làm Quiz"
              value={totalQuizAttempts}
              color="#dc2626"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
            <StatsCard
              title="Bài nộp"
              value={totalSubmissions}
              color="#7c3aed"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-[#106c54] text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quản lý Quiz
            </button>
            <button
              onClick={() => setActiveTab('assignment')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'assignment'
                  ? 'bg-[#106c54] text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quản lý Bài Tập
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {!selectedCourseId ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chọn khóa học để bắt đầu</h3>
              <p className="text-gray-600">Vui lòng chọn một khóa học từ dropdown phía trên để quản lý quiz và bài tập</p>
            </div>
          ) : (
            <>
              {activeTab === 'quiz' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Danh sách Quiz
                      {selectedLectureId && lectures.find(l => l.lectureId === selectedLectureId) && (
                        <span className="text-sm font-normal text-gray-600 ml-2">
                          - {lectures.find(l => l.lectureId === selectedLectureId)?.title}
                        </span>
                      )}
                    </h2>
                    {(!selectedCourseId || !selectedSessionId || !selectedLectureId) && (
                      <div className="text-orange-600 text-sm bg-orange-50 px-3 py-2 rounded-lg">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Chọn đầy đủ khóa học → chương → bài giảng để tạo quiz mới và xem danh sách quiz
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setEditingQuiz(null);
                        setIsQuizModalOpen(true);
                      }}
                      disabled={!selectedCourseId || !selectedSessionId || !selectedLectureId}
                      className="bg-[#106c54] text-white px-4 py-2 rounded-lg hover:bg-[#0d5942] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Tạo Quiz Mới
                    </button>
                  </div>
              
              {!selectedLectureId ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <div className="text-yellow-600 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chọn bài giảng để xem quiz</h3>
                  <p className="text-gray-600">Vui lòng chọn chương và bài giảng cụ thể để xem danh sách quiz thuộc bài giảng đó</p>
                </div>
              ) : loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#106c54] mx-auto"></div>
                  <p className="text-gray-600 mt-2">Đang tải...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quizzes.map((quiz) => (
                    <QuizCard
                      key={quiz.id}
                      quiz={{
                        ...quiz,
                        totalAttempts: quizStats[quiz.id]?.totalAttempts || 0,
                        averageScore: quizStats[quiz.id]?.averageScore || 0,
                      }}
                      userRole="INSTRUCTOR"
                      onEdit={handleEditQuiz}
                      onDelete={handleDeleteQuiz}
                      onViewStats={handleViewQuizStats}
                      onManageQuestions={handleManageQuestions}
                    />
                  ))}
                  {quizzes.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      Chưa có quiz nào
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'assignment' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Danh sách Bài Tập</h2>
                <button
                  onClick={() => {
                    setEditingAssignment(null);
                    setIsAssignmentModalOpen(true);
                  }}
                  disabled={!selectedCourseId}
                  className="bg-[#106c54] text-white px-4 py-2 rounded-lg hover:bg-[#0d5942] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Tạo Bài Tập Mới
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#106c54] mx-auto"></div>
                  <p className="text-gray-600 mt-2">Đang tải...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={{
                        ...assignment,
                        totalSubmissions: assignmentStats[assignment.id]?.totalSubmissions || 0,
                        gradedSubmissions: assignmentStats[assignment.id]?.gradedSubmissions || 0,
                        averageGrade: assignmentStats[assignment.id]?.averageGrade || 0,
                      }}
                      userRole="INSTRUCTOR"
                      onEdit={(assignmentId: UUID) => {
                        const foundAssignment = assignments.find(a => a.id === assignmentId);
                        if (foundAssignment) {
                          setEditingAssignment(foundAssignment);
                          setIsAssignmentModalOpen(true);
                        }
                      }}
                      onDelete={handleDeleteAssignment}
                      onViewSubmissions={handleViewAssignmentSubmissions}
                    />
                  ))}
                  {assignments.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      Chưa có bài tập nào
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          </>
        )}
        </div>
      </div>

      {/* Modals */}
      <QuizFormModal
        isOpen={isQuizModalOpen}
        onClose={() => {
          setIsQuizModalOpen(false);
          setEditingQuiz(null);
        }}
        onSubmit={editingQuiz ? handleUpdateQuiz : handleCreateQuiz}
        initialData={editingQuiz}
        lectureId={selectedLectureId || undefined}
        title={editingQuiz ? 'Chỉnh sửa Quiz' : 'Tạo Quiz Mới'}
      />

      <AssignmentFormModal
        isOpen={isAssignmentModalOpen}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setEditingAssignment(null);
        }}
        onSubmit={editingAssignment ? handleEditAssignment : handleCreateAssignment}
        initialData={editingAssignment}
        courseId={selectedCourseId || undefined}
        title={editingAssignment ? 'Chỉnh sửa Bài Tập' : 'Tạo Bài Tập Mới'}
      />

      <QuizQuestionManager
        isOpen={isQuizQuestionModalOpen}
        onClose={() => {
          setIsQuizQuestionModalOpen(false);
          setSelectedQuizForQuestions(null);
        }}
        quizId={selectedQuizForQuestions || ('' as UUID)}
      />
    </div>
  );
};
