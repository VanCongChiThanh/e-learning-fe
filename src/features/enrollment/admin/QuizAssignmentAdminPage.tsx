import React from 'react';
import { useParams } from 'react-router-dom';
import { UUID } from 'crypto';
import { QuizAssignmentAdmin } from './QuizAssignmentAdmin';

export const QuizAssignmentAdminPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  if (!courseId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course ID không hợp lệ</h1>
          <p className="text-gray-600">Vui lòng chọn một khóa học để quản lý quiz và bài tập.</p>
        </div>
      </div>
    );
  }

  return (
    <QuizAssignmentAdmin 
      courseId={courseId as UUID}
    />
  );
};

export default QuizAssignmentAdminPage;