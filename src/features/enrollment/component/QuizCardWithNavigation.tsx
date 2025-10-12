import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UUID } from 'crypto';
import { QuizCard } from './QuizCard';

interface QuizCardWithNavigationProps {
  quiz: {
    id: UUID;
    title: string;
    description?: string;
    lectureId: UUID;
    maxAttempts?: number;
    passingScore?: number;
    timeLimitMinutes?: number;
    createdAt?: string;
    numberQuestions?: number;
    averageScore?: number;
  };
  userRole: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  enrollmentId?: UUID;
  onEdit?: (quizId: UUID) => void;
  onDelete?: (quizId: UUID) => void;
  onViewStats?: (quizId: UUID) => void;
  onManageQuestions?: (quizId: UUID) => void;
  className?: string;
}

export const QuizCardWithNavigation: React.FC<QuizCardWithNavigationProps> = ({
  quiz,
  userRole,
  enrollmentId,
  onEdit,
  onDelete,
  onViewStats,
  onManageQuestions,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleTakeQuiz = (quizId: UUID) => {
    if (enrollmentId) {
      navigate(`/learn/quiz/${quizId}/${enrollmentId}`);
    } else {
      console.error('EnrollmentId is required to take quiz');
    }
  };

  return (
    <QuizCard
      quiz={quiz}
      userRole={userRole}
      onEdit={onEdit}
      onDelete={onDelete}
      onTakeQuiz={handleTakeQuiz}
      onViewStats={onViewStats}
      onManageQuestions={onManageQuestions}
      className={className}
    />
  );
};