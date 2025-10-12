import React from 'react';
import { Modal } from '../common/UI';
import { QuizStatsCard } from './QuizStatsCard';

interface QuizStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEnrollment: any;
}

export const QuizStatisticsModal: React.FC<QuizStatisticsModalProps> = ({
  isOpen,
  onClose,
  selectedEnrollment,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thống kê Quiz"
      size="xl"
    >
      {selectedEnrollment?.quizStats && (
        <div className="space-y-6">
          {/* Quiz Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuizStatsCard
              title="Tổng Quiz"
              value={selectedEnrollment.quizStats.totalQuizzes}
              subtitle="quiz được giao"
              color="#3b82f6"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
            <QuizStatsCard
              title="Đã hoàn thành"
              value={selectedEnrollment.quizStats.completedQuizzes}
              subtitle={`${Math.round((selectedEnrollment.quizStats.completedQuizzes / selectedEnrollment.quizStats.totalQuizzes) * 100)}% tỷ lệ`}
              color="#10b981"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <QuizStatsCard
              title="Điểm TB"
              value={`${selectedEnrollment.quizStats.averageScore}%`}
              subtitle="trung bình cộng"
              color="#8b5cf6"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              trend={{
                value: Math.floor(Math.random() * 10) + 5,
                isPositive: selectedEnrollment.quizStats.averageScore > 70
              }}
            />
            <QuizStatsCard
              title="Điểm cao nhất"
              value={`${selectedEnrollment.quizStats.highestScore}%`}
              subtitle="kết quả tốt nhất"
              color="#f59e0b"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
            />
          </div>

          {/* Quiz Details List */}
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Chi tiết từng Quiz</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedEnrollment.quizStats.quizDetails.map((quiz: any) => (
                <div key={quiz.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-800">{quiz.title}</h5>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      quiz.score >= 80 ? 'bg-green-100 text-green-800' :
                      quiz.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quiz.score}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Lần thử:</span>
                      <p className="font-medium">{quiz.attempts}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Thời gian:</span>
                      <p className="font-medium">{quiz.timeSpent} phút</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Hoàn thành:</span>
                      <p className="font-medium">{new Date(quiz.completedAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};