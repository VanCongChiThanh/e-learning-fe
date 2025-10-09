import React, { useState, useEffect } from "react";
import { UUID } from "../utils/UUID";
import { useProgressByLecture } from "../hook/useProgress";
import { useQuizzesByLecture } from "../hook/useQuiz";
import { StatsCard } from "../common/Progress";
import { LoadingSpinner, ErrorMessage, EmptyState } from "../common/States";
import { QuizCard } from "../component/QuizCard";
import { QuizTakeModal } from "../component/QuizAssignmentLearning";
import { getQuizQuestionsByQuizId } from "../api/quizQA";
import { createQuizAttempt } from "../api/quizAttempt";
interface ProgressProps {
  selectedLectureId: UUID;
  userId: UUID;
  enrollmentId?: UUID;
}

const Progress: React.FC<ProgressProps> = ({ selectedLectureId, userId, enrollmentId}) => {
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const {
    progress: progressList,
    loading: progressLoading,
    error: progressError,
  } = useProgressByLecture(selectedLectureId);
  
  const { quizzes, loading: quizzesLoading } = useQuizzesByLecture(selectedLectureId);

  const fetchQuestionsByQuiz = async (quizId: UUID) => {
    try {
      return await getQuizQuestionsByQuizId(quizId);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    }
  };

  const handleTakeQuiz = async (quizId: UUID) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    setSelectedQuiz(quiz);
    const questions = await fetchQuestionsByQuiz(quizId);
    setQuizQuestions(questions);
    setIsQuizModalOpen(true);
  };

  const handleSubmitQuiz = async (answers: Record<UUID, string>) => {
    if (!selectedQuiz) return;
    try {
      // Calculate score
      let correctAnswers = 0;
      const currentTime = new Date().toISOString();
      
      // Create quiz attempts for each question
      for (const question of quizQuestions) {
        const selectedOption = answers[question.id] || '';
        const isCorrect = selectedOption === question.correctAnswer;
        const pointsEarned = isCorrect ?  question.points : 0;
        await createQuizAttempt({
          quizId: selectedQuiz.id,
          userId: userId,
          enrollmentId: enrollmentId,
          questionId: question.id,
          selectedOption: selectedOption,
          attemptNumber: 1,
          timeTakenMinutes: 0
        });
        
        if (isCorrect) {
          correctAnswers++;
        }
      }
      
      const score = (correctAnswers / quizQuestions.length) * 100;
      alert(`Bạn đã hoàn thành quiz với điểm số: ${score.toFixed(1)}%`);
      setIsQuizModalOpen(false);
      setSelectedQuiz(null);
      setQuizQuestions([]);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Có lỗi xảy ra khi nộp bài quiz');
    }
  };
  
  if (progressLoading || quizzesLoading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  if (progressError) {
    return (
      <ErrorMessage
        message={progressError}
        className="m-6"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tiến độ học tập</h1>
        <p className="text-gray-600">Theo dõi tiến độ học tập của bạn trong từng bài học</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Đã hoàn thành"
          value={progressList?.isCompleted ? "Có" : "Chưa"}
          color="#10b981"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Thời gian học"
          value={`${progressList?.watchTimeMinutes} phút`}
          color="#f59e0b"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Ngày hoàn thành"
          value={`${progressList?.completionDate ? new Date(progressList.completionDate).toLocaleDateString() : "Chưa hoàn thành"}`}
          color="#8b5cf6"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Quiz Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz cho bài giảng này</h2>
        {quizzes && quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                userRole="LEARNER"
                onTakeQuiz={handleTakeQuiz}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>Chưa có quiz nào cho bài giảng này</p>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      <QuizTakeModal
        isOpen={isQuizModalOpen}
        onClose={() => {
          setIsQuizModalOpen(false);
          setSelectedQuiz(null);
          setQuizQuestions([]);
        }}
        quiz={selectedQuiz || { id: '' as UUID, title: '', description: '' }}
        questions={quizQuestions}
        onSubmit={handleSubmitQuiz}
      />
    </div>
)};

export default Progress;