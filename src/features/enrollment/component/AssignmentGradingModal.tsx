import React, { useState, useEffect } from 'react';
import { UUID } from 'crypto';
import { getAssignmentSubmissionsByAssignment, gradeAssignmentSubmission } from '../api/assignmentSubmission';
import { StatusBadge } from '../common/Progress';

interface AssignmentGradingModalProps {
  assignmentId: UUID;
  isOpen: boolean;
  onClose: () => void;
  assignment?: {
    title: string;
    description?: string;
    dueDate?: string;
  };
}

export const AssignmentGradingModal: React.FC<AssignmentGradingModalProps> = ({
  assignmentId,
  isOpen,
  onClose,
  assignment,
}) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    grade: '',
    feedback: '',
  });

  useEffect(() => {
    if (isOpen && assignmentId) {
      fetchSubmissions();
    }
  }, [isOpen, assignmentId]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getAssignmentSubmissionsByAssignment(assignmentId);
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubmission = (submission: any) => {
    setSelectedSubmission(submission);
    setGradeForm({
      grade: submission.grade?.toString() || '',
      feedback: submission.feedback || '',
    });
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !gradeForm.grade) return;

    setGrading(true);
    try {
      await gradeAssignmentSubmission(selectedSubmission.id, {
        grade: parseFloat(gradeForm.grade),
        feedback: gradeForm.feedback || undefined,
      });

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === selectedSubmission.id 
            ? { ...sub, grade: parseFloat(gradeForm.grade), feedback: gradeForm.feedback }
            : sub
        )
      );

      setSelectedSubmission(null);
      setGradeForm({ grade: '', feedback: '' });
      alert('Chấm điểm thành công!');
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Có lỗi xảy ra khi chấm điểm');
    } finally {
      setGrading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getSubmissionStatus = (submission: any) => {
    if (submission.grade !== undefined) return 'completed';
    return 'in_progress';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Chấm điểm bài tập: {assignment?.title}
              </h3>
              {assignment?.description && (
                <p className="text-gray-600 mt-1">{assignment.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Hạn nộp: {formatDate(assignment?.dueDate)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Submissions List */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-4 border-b bg-gray-50">
              <h4 className="font-medium text-gray-900">
                Danh sách bài nộp ({submissions.length})
              </h4>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#106c54] mx-auto"></div>
              </div>
            ) : (
              <div className="divide-y">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedSubmission?.id === submission.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleSelectSubmission(submission)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {submission.user?.name || 'Học sinh'}
                      </span>
                      <StatusBadge status={getSubmissionStatus(submission)} />
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>Nộp: {formatDate(submission.submittedAt)}</p>
                      {submission.grade !== undefined && (
                        <p className="text-green-600 font-medium">
                          Điểm: {submission.grade}/10
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {submissions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có bài nộp nào
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submission Detail & Grading */}
          <div className="w-2/3 flex flex-col">
            {selectedSubmission ? (
              <>
                {/* Submission Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-lg font-medium text-gray-900">
                        Bài làm của {selectedSubmission.user?.name || 'Học sinh'}
                      </h5>
                      <span className="text-sm text-gray-500">
                        {formatDate(selectedSubmission.submittedAt)}
                      </span>
                    </div>
                    
                    {selectedSubmission.grade !== undefined && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Đã chấm: {selectedSubmission.grade}/10
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h6 className="font-medium text-gray-900 mb-2">Nội dung bài làm:</h6>
                    <div className="whitespace-pre-wrap text-gray-700">
                      {selectedSubmission.content}
                    </div>
                  </div>

                  {selectedSubmission.feedback && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h6 className="font-medium text-blue-900 mb-2">Nhận xét:</h6>
                      <p className="text-blue-800">{selectedSubmission.feedback}</p>
                    </div>
                  )}
                </div>

                {/* Grading Form */}
                <div className="border-t p-6 bg-gray-50">
                  <form onSubmit={handleGradeSubmission}>
                    <h6 className="font-medium text-gray-900 mb-4">Chấm điểm</h6>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Điểm (0-10) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={gradeForm.grade}
                          onChange={(e) => setGradeForm(prev => ({ ...prev, grade: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent"
                          placeholder="Nhập điểm..."
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nhận xét
                        </label>
                        <textarea
                          value={gradeForm.feedback}
                          onChange={(e) => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#106c54] focus:border-transparent resize-none"
                          rows={2}
                          placeholder="Nhập nhận xét..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubmission(null);
                          setGradeForm({ grade: '', feedback: '' });
                        }}
                        className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={grading || !gradeForm.grade}
                        className="px-6 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5942] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {grading ? 'Đang chấm...' : 'Lưu điểm'}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Chọn một bài nộp để xem chi tiết và chấm điểm
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};