import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UUID } from 'crypto';
import { useQuizzesByLecture } from '../hook/useQuiz';
import { useSessionsByCourse } from '../hook/useSession';
import { useLecturesBySession } from '../hook/useSession';
import { useQuizStats } from '../hook/useQuizAssignmentStats';
import { QuizCard } from '../component/QuizCard';
import { StatsCard } from '../common/Progress';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

const CourseQuizManagement: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // State for selections
  const [selectedSessionId, setSelectedSessionId] = useState<UUID | null>(null);
  const [selectedLectureId, setSelectedLectureId] = useState<UUID | null>(null);

  // Data hooks
  const { sessions, loading: sessionsLoading } = useSessionsByCourse(courseId as UUID);
  const { lectures, loading: lecturesLoading } = useLecturesBySession(selectedSessionId || undefined);
  const { 
    quizzes, 
    loading: quizzesLoading, 
    removeQuiz 
  } = useQuizzesByLecture(selectedLectureId || undefined);
  const { quizStats, loading: quizStatsLoading } = useQuizStats(quizzes);

  // Computed values
  const loading = quizzesLoading || quizStatsLoading;
  const totalQuizzes = quizzes.length;
  const totalQuizAttempts = Object.values(quizStats).reduce((sum: number, stat: any) => sum + (stat.totalAttempts || 0), 0);
  const averageScore = quizzes.length > 0 ? 
    Object.values(quizStats).reduce((sum: number, stat: any) => sum + (stat.averageScore || 0), 0) / quizzes.length : 0;
  const totalQuestions = quizzes.reduce((acc, quiz) => acc + (quiz.numberQuestions || 0), 0);

  // Effects for resetting selections
  useEffect(() => {
    setSelectedLectureId(null);
  }, [selectedSessionId]);

  const handleCreateQuiz = () => {
    if (!selectedLectureId) {
      alert('Vui lòng chọn bài giảng trước khi tạo quiz');
      return;
    }
    navigate(`/teacher/course/${courseId}/quiz/create/${selectedLectureId}`);
  };

  const handleEditQuiz = (quizId: UUID) => {
    navigate(`/teacher/course/${courseId}/quiz/${quizId}/edit`);
  };

  const handleDeleteQuiz = async (quizId: UUID) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa quiz này?')) return;
    
    try {
      await removeQuiz(quizId);
      alert('Xóa quiz thành công');
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa quiz');
      console.error('Error deleting quiz:', error);
    }
  };

  const handleViewStats = (quizId: UUID) => {
    navigate(`/teacher/course/${courseId}/quiz/${quizId}/statistics`);
  };

  const handleManageQuestions = (quizId: UUID) => {
    navigate(`/teacher/course/${courseId}/quiz/${quizId}/questions`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(`/teacher/course/${courseId}`)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại chi tiết khóa học
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Quiz</h1>
              <p className="text-gray-600 mt-2">Tạo và quản lý các bài quiz cho khóa học</p>
            </div>
            <button
              onClick={handleCreateQuiz}
              disabled={!selectedLectureId}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tạo Quiz Mới
            </button>
          </div>
        </div>

        {/* Session and Lecture Selectors */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Chọn chương và bài giảng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn chương
              </label>
              <select
                value={selectedSessionId || ''}
                onChange={(e) => setSelectedSessionId(e.target.value as UUID)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={sessionsLoading}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          
          {(!selectedSessionId || !selectedLectureId) && (
            <div className="mt-4 text-orange-600 text-sm bg-orange-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Chọn đầy đủ chương → bài giảng để xem danh sách quiz và tạo quiz mới
            </div>
          )}
        </div>

        {/* Quiz Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Tổng Quiz"
            value={totalQuizzes}
            color="#2563eb"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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
            title="Điểm trung bình"
            value={Math.round(averageScore)}
            color="#16a34a"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <StatsCard
            title="Tổng câu hỏi"
            value={totalQuestions}
            color="#7c3aed"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Quiz List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách Quiz
              {selectedLectureId && lectures.find(l => l.lectureId === selectedLectureId) && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - {lectures.find(l => l.lectureId === selectedLectureId)?.title}
                </span>
              )}
            </h2>
          </div>
          
          <div className="p-6">
            {!selectedLectureId ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chọn bài giảng để xem quiz</h3>
                <p className="mt-1 text-sm text-gray-500">Vui lòng chọn chương và bài giảng cụ thể để xem danh sách quiz thuộc bài giảng đó.</p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Đang tải...</p>
              </div>
            ) : quizzes.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={{
                      ...quiz,
                      totalAttempts: quizStats[quiz.id]?.totalAttempts || 0,
                      averageScore: quizStats[quiz.id]?.averageScore || 0,
                    }}
                    userRole="INSTRUCTOR"
                    onEdit={() => handleEditQuiz(quiz.id)}
                    onDelete={() => handleDeleteQuiz(quiz.id)}
                    onViewStats={() => handleViewStats(quiz.id)}
                    onManageQuestions={() => handleManageQuestions(quiz.id)}
                    className="h-full"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có quiz nào</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Bắt đầu bằng cách tạo quiz đầu tiên cho bài giảng{' '}
                  {lectures.find(l => l.lectureId === selectedLectureId)?.title}.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCreateQuiz}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tạo Quiz Mới
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseQuizManagement;