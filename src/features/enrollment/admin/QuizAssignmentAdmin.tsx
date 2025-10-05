import React, { useState, useEffect } from 'react';
import { UUID } from 'crypto';
import { QuizCard } from '../component/QuizCard';
import { AssignmentCard } from '../component/AssignmentCard';
import { QuizFormModal, AssignmentFormModal } from '../component/QuizAssignmentModals';
import { StatsCard } from '../common/Progress';
import { 
  createQuiz, 
  updateQuiz, 
  deleteQuiz,
  getAllQuizzesByLectureId,
  getQuizById 
} from '../api/quiz';
import { 
  createAssignment, 
  updateAssignment, 
  deleteAssignment,
  getAssignmentsByCourseId 
} from '../api/assignment';
import { getQuizAttemptsByQuiz } from '../api/quizAttempt';
import { getAssignmentSubmissionsByAssignment } from '../api/assignmentSubmission';
import { getCourseById } from '../api/course';
import { getProgressByEnrollmentId } from '../api/progress';
import { getEnrollmentByCourseId } from '../api/enrollment';


interface QuizAssignmentAdminProps {
  courseId?: UUID;
  lectureId?: UUID;
}

export const QuizAssignmentAdmin: React.FC<QuizAssignmentAdminProps> = ({ courseId, lectureId }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'assignment' | 'analytics' | 'progress'>('analytics');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [allQuizzes, setAllQuizzes] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizStats, setQuizStats] = useState<any>({});
  const [assignmentStats, setAssignmentStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    totalQuizzes: 0,
    totalAssignments: 0,
    totalQuizAttempts: 0,
    totalSubmissions: 0,
    averageQuizScore: 0,
    averageAssignmentGrade: 0,
    completionRate: 0,
    totalStudents: 0,
    activeStudents: 0,
  });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch course details
      if (courseId) {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
        
        // Fetch enrollments
        const enrollmentData = await getEnrollmentByCourseId(courseId);
        setEnrollments(enrollmentData.data || enrollmentData);
        
        // Fetch assignments
        const assignmentData = await getAssignmentsByCourseId(courseId);
        setAssignments(assignmentData);
        
        // Fetch all quizzes from all lectures in the course
        const allQuizzesData: any[] = [];
        if (courseData?.lectures) {
          for (const lecture of courseData.lectures) {
            try {
              const lectureQuizzes = await getAllQuizzesByLectureId(lecture.id);
              allQuizzesData.push(...lectureQuizzes.map((quiz: any) => ({
                ...quiz,
                lectureName: lecture.title || `Lecture ${lecture.id}`
              })));
            } catch (error) {
              console.log(`No quizzes found for lecture ${lecture.id}`);
            }
          }
        }
        setAllQuizzes(allQuizzesData);
      }
      
      // Fetch quizzes for specific lecture
      if (lectureId) {
        const quizData = await getAllQuizzesByLectureId(lectureId);
        setQuizzes(quizData);
      }
      
      // Fetch progress data for enrolled students
      await fetchProgressData();
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch progress data
  const fetchProgressData = async () => {
    if (!courseId || enrollments.length === 0) return;
    
    try {
      const progressPromises = enrollments.map(enrollment => 
        getProgressByEnrollmentId(enrollment.id).catch(() => null)
      );
      const progressResults = await Promise.all(progressPromises);
      setProgressData(progressResults.filter(Boolean));
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId, lectureId]);

  // Fetch statistics
  useEffect(() => {
    fetchQuizStats();
    fetchAssignmentStats();
    calculateAnalytics();
  }, [allQuizzes, assignments, enrollments, progressData]);

  const fetchQuizStats = async () => {
    const stats: any = {};
    let totalAttempts = 0;
    let totalScore = 0;
    let totalScoreCount = 0;

    for (const quiz of allQuizzes) {
      try {
        const attempts = await getQuizAttemptsByQuiz(quiz.id);
        const validAttempts = attempts.filter((a: any) => a.score !== undefined);
        const avgScore = validAttempts.length > 0 
          ? validAttempts.reduce((sum: number, attempt: any) => sum + attempt.score, 0) / validAttempts.length 
          : 0;
        
        stats[quiz.id] = {
          totalAttempts: attempts.length,
          averageScore: avgScore,
          completionRate: enrollments.length > 0 ? (attempts.length / enrollments.length) * 100 : 0,
        };
        
        totalAttempts += attempts.length;
        totalScore += validAttempts.reduce((sum: number, attempt: any) => sum + attempt.score, 0);
        totalScoreCount += validAttempts.length;
      } catch (error) {
        console.error(`Error fetching stats for quiz ${quiz.id}:`, error);
        stats[quiz.id] = {
          totalAttempts: 0,
          averageScore: 0,
          completionRate: 0,
        };
      }
    }
    
    setQuizStats(stats);
    setAnalytics(prev => ({
      ...prev,
      totalQuizAttempts: totalAttempts,
      averageQuizScore: totalScoreCount > 0 ? totalScore / totalScoreCount : 0,
    }));
  };

  const fetchAssignmentStats = async () => {
    const stats: any = {};
    let totalSubmissions = 0;
    let totalGrade = 0;
    let totalGradeCount = 0;

    for (const assignment of assignments) {
      try {
        const submissions = await getAssignmentSubmissionsByAssignment(assignment.id);
        const gradedSubmissions = submissions.filter((s: any) => s.grade !== undefined);
        const avgGrade = gradedSubmissions.length > 0 
          ? gradedSubmissions.reduce((sum: number, sub: any) => sum + sub.grade, 0) / gradedSubmissions.length 
          : 0;
        
        stats[assignment.id] = {
          totalSubmissions: submissions.length,
          gradedSubmissions: gradedSubmissions.length,
          averageGrade: avgGrade,
        };
        
        totalSubmissions += submissions.length;
        totalGrade += gradedSubmissions.reduce((sum: number, sub: any) => sum + sub.grade, 0);
        totalGradeCount += gradedSubmissions.length;
      } catch (error) {
        console.error(`Error fetching stats for assignment ${assignment.id}:`, error);
      }
    }
    
    setAssignmentStats(stats);
    setAnalytics(prev => ({
      ...prev,
      totalAssignments: assignments.length,
      totalSubmissions: totalSubmissions,
      averageAssignmentGrade: totalGradeCount > 0 ? totalGrade / totalGradeCount : 0,
    }));
  };

  const calculateAnalytics = () => {
    const totalActivities = allQuizzes.length + assignments.length;
    const totalCompletions = Object.values(quizStats).reduce((sum: number, stat: any) => sum + (stat.totalAttempts || 0), 0) +
                           Object.values(assignmentStats).reduce((sum: number, stat: any) => sum + (stat.totalSubmissions || 0), 0);
    
    const totalStudents = enrollments.length;
    const activeStudents = progressData.filter(progress => progress && progress.watchedPercentage > 0).length;
    const completionRate = totalStudents > 0 && totalActivities > 0 ? (totalCompletions / (totalStudents * totalActivities)) * 100 : 0;
    
    setAnalytics(prev => ({
      ...prev,
      totalQuizzes: allQuizzes.length,
      totalAssignments: assignments.length,
      totalStudents,
      activeStudents,
      completionRate,
    }));
  };

  const handleCreateQuiz = async (data: { 
    lectureId: UUID; 
    title: string; 
    description?: string; 
    maxAttempts: number; 
    passingScore: number; 
    timeLimitMinutes: number;
    numberQuizQuestions: number;
  }) => {
    try {
      await createQuiz({
        lectureId: data.lectureId,
        title: data.title,
        description: data.description,
        maxAttempts: data.maxAttempts,
        passingScore: data.passingScore,
        timeLimitMinutes: data.timeLimitMinutes,
      });
      fetchData();
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
    lectureId: UUID; 
    title: string; 
    description?: string; 
    maxAttempts: number; 
    passingScore: number; 
    timeLimitMinutes: number;
    numberQuizQuestions: number;
  }) => {
    if (!editingQuiz) return;
    
    try {
      await updateQuiz(editingQuiz.id, {
        title: data.title,
        description: data.description,
        maxAttempts: data.maxAttempts,
        passingScore: data.passingScore,
        timeLimitMinutes: data.timeLimitMinutes,
        numberQuizQuestions: data.numberQuizQuestions,
      });
      fetchData();
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
      await deleteQuiz(quizId);
      fetchData();
      alert('Xóa quiz thành công!');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Có lỗi xảy ra khi xóa quiz');
    }
  };

  const handleCreateAssignment = async (data: { courseId: UUID; title: string; description?: string; dueDate?: string }) => {
    try {
      await createAssignment(data);
      fetchData();
      alert('Tạo bài tập thành công!');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Có lỗi xảy ra khi tạo bài tập');
    }
  };

  const handleEditAssignment = (assignmentId: UUID) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      setEditingAssignment(assignment);
      setIsAssignmentModalOpen(true);
    }
  };

  const handleUpdateAssignment = async (data: { courseId: UUID; title: string; description?: string; dueDate?: string }) => {
    if (!editingAssignment) return;
    
    try {
      await updateAssignment(editingAssignment.id, {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
      });
      fetchData();
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
      await deleteAssignment(assignmentId);
      fetchData();
      alert('Xóa bài tập thành công!');
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Có lỗi xảy ra khi xóa bài tập');
    }
  };

  const handleViewQuizStats = (quizId: UUID) => {
    console.log('View quiz stats for:', quizId);
    // Navigate to detailed quiz statistics page
  };

  const handleViewAssignmentSubmissions = (assignmentId: UUID) => {
    console.log('View assignment submissions for:', assignmentId);
    // Navigate to detailed assignment submissions page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quản lý Hệ thống Quiz & Bài Tập</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-[#106c54] text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Thống kê tổng quan
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-[#106c54] text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả Quiz
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
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'progress'
                  ? 'bg-[#106c54] text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tiến độ học tập
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard Thống kê</h2>
              
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <StatsCard
                  title="Tổng học viên"
                  value={analytics.totalStudents}
                  color="#10b981"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  }
                />
                <StatsCard
                  title="Học viên hoạt động"
                  value={analytics.activeStudents}
                  color="#3b82f6"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <StatsCard
                  title="Tổng Quiz"
                  value={analytics.totalQuizzes}
                  color="#106c54"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                />
                <StatsCard
                  title="Lượt làm Quiz"
                  value={analytics.totalQuizAttempts}
                  color="#dc2626"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                />
                <StatsCard
                  title="Tổng Bài Tập"
                  value={analytics.totalAssignments}
                  color="#2563eb"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  }
                />
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                  title="Điểm TB Quiz"
                  value={`${analytics.averageQuizScore.toFixed(1)}%`}
                  color="#f59e0b"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  }
                />
                <StatsCard
                  title="Điểm TB Bài Tập"
                  value={analytics.averageAssignmentGrade.toFixed(1)}
                  color="#10b981"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                />
                <StatsCard
                  title="Tỷ lệ hoàn thành"
                  value={`${analytics.completionRate.toFixed(1)}%`}
                  color="#8b5cf6"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                />
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Tất cả Quiz trong khóa học</h2>
                  {course && <p className="text-gray-600">Khóa học: {course.title}</p>}
                </div>
                <button
                  onClick={() => {
                    setEditingQuiz(null);
                    setIsQuizModalOpen(true);
                  }}
                  className="bg-[#106c54] text-white px-4 py-2 rounded-lg hover:bg-[#0d5942] transition-colors duration-200"
                >
                  Tạo Quiz Mới
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#106c54] mx-auto"></div>
                  <p className="text-gray-600 mt-2">Đang tải...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {allQuizzes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có quiz nào trong khóa học này
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allQuizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-300">
                          <div className="p-6">
                            {/* Lecture info */}
                            <div className="mb-3">
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {quiz.lectureName}
                              </span>
                            </div>
                            
                            {/* Quiz info */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                            {quiz.description && (
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
                            )}
                            
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-[#106c54]">
                                  {quizStats[quiz.id]?.totalAttempts || 0}
                                </div>
                                <div className="text-xs text-gray-500">Lượt làm</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {(quizStats[quiz.id]?.averageScore || 0).toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-500">Điểm TB</div>
                              </div>
                            </div>
                            
                            {/* Completion rate */}
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Tỷ lệ hoàn thành</span>
                                <span>{(quizStats[quiz.id]?.completionRate || 0).toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-[#106c54] h-2 rounded-full" 
                                  style={{ width: `${Math.min(quizStats[quiz.id]?.completionRate || 0, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Action buttons */}
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditQuiz(quiz.id)}
                                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleViewQuizStats(quiz.id)}
                                className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                Thống kê
                              </button>
                              <button
                                onClick={() => handleDeleteQuiz(quiz.id)}
                                className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'assignment' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Quản lý Bài Tập</h2>
                <button
                  onClick={() => {
                    setEditingAssignment(null);
                    setIsAssignmentModalOpen(true);
                  }}
                  className="bg-[#106c54] text-white px-4 py-2 rounded-lg hover:bg-[#0d5942] transition-colors duration-200"
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
                      userRole="ADMIN"
                      onEdit={handleEditAssignment}
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

          {activeTab === 'progress' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tiến độ học tập của học viên</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#106c54] mx-auto"></div>
                  <p className="text-gray-600 mt-2">Đang tải...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary stats */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan tiến độ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#106c54]">{analytics.totalStudents}</div>
                        <div className="text-sm text-gray-600">Tổng học viên</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{analytics.activeStudents}</div>
                        <div className="text-sm text-gray-600">Đang học</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {analytics.totalStudents > 0 ? ((analytics.activeStudents / analytics.totalStudents) * 100).toFixed(1) : 0}%
                        </div>
                        <div className="text-sm text-gray-600">Tỷ lệ tham gia</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">
                          {analytics.completionRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
                      </div>
                    </div>
                  </div>

                  {/* Student progress table */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Chi tiết tiến độ từng học viên</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Học viên
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tiến độ xem video
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thời gian học
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quiz hoàn thành
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Bài tập nộp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Lần truy cập cuối
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {enrollments.map((enrollment, index) => {
                            const progress = progressData.find(p => p?.enrollmentId === enrollment.id);
                            const studentQuizAttempts = allQuizzes.reduce((total, quiz) => {
                              return total + (quizStats[quiz.id]?.totalAttempts || 0);
                            }, 0);
                            
                            return (
                              <tr key={enrollment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <div className="h-10 w-10 rounded-full bg-[#106c54] flex items-center justify-center">
                                        <span className="text-white font-medium">
                                          {enrollment.student?.name?.charAt(0) || enrollment.student?.email?.charAt(0) || 'U'}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {enrollment.student?.name || enrollment.student?.email || 'Unknown'}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {enrollment.student?.email || ''}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-1">
                                      <div className="text-sm text-gray-900">
                                        {(progress?.watchedPercentage || 0).toFixed(1)}%
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                        <div 
                                          className="bg-[#106c54] h-2 rounded-full" 
                                          style={{ width: `${Math.min(progress?.watchedPercentage || 0, 100)}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {progress?.watchedDurationMinutes ? `${Math.round(progress.watchedDurationMinutes)} phút` : '0 phút'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {/* This would need additional API to get student-specific quiz attempts */}
                                  <span className="text-gray-500">-</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {/* This would need additional API to get student-specific assignment submissions */}
                                  <span className="text-gray-500">-</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {progress?.lastWatchedAt 
                                    ? new Date(progress.lastWatchedAt).toLocaleDateString('vi-VN')
                                    : 'Chưa từng truy cập'
                                  }
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      
                      {enrollments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Chưa có học viên nào đăng ký khóa học này
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
        lectureId={lectureId}
        title={editingQuiz ? 'Chỉnh sửa Quiz' : 'Tạo Quiz Mới'}
      />

      <AssignmentFormModal
        isOpen={isAssignmentModalOpen}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setEditingAssignment(null);
        }}
        onSubmit={editingAssignment ? handleUpdateAssignment : handleCreateAssignment}
        initialData={editingAssignment}
        courseId={courseId}
        title={editingAssignment ? 'Chỉnh sửa Bài Tập' : 'Tạo Bài Tập Mới'}
      />
    </div>
  );
};