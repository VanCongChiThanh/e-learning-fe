import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UUID } from "../utils/UUID";
import { useLecturesBySession, useLectureStats } from "../hook/useSession";
import LectureList from "../component/LectureList";

const LectureListPage: React.FC = () => {
  const navigate = useNavigate();
  const { enrollmentId, courseId, sessionId } = useParams<{ 
    enrollmentId: string; 
    courseId: string; 
    sessionId: string;
  }>();
  
  const { lectures, loading: lecturesLoading, error: lecturesError } = useLecturesBySession(sessionId as UUID, enrollmentId as UUID);
  const lectureStats = useLectureStats(sessionId as UUID, enrollmentId as UUID);

  const handleLectureClick = (lectureId: UUID) => {
    // Điều hướng đến trang progress với lectureId
    navigate(`/learn/progress/${enrollmentId}/${courseId}/${sessionId}/${lectureId}`);
  };

  const handleBackToSessions = () => {
    navigate(`/learn/sessions/${enrollmentId}/${courseId}`);
  };

  if (lecturesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54]"></div>
      </div>
    );
  }

  if (lecturesError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-600">
          <p className="font-medium">Có lỗi xảy ra khi tải bài giảng</p>
          <p className="text-sm mt-1">{lecturesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={handleBackToSessions}
            className="flex items-center text-[#106c54] hover:text-[#0d5a47] mb-2"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách sessions
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Danh sách Bài giảng</h1>
          <p className="text-gray-600 mt-1">Chọn bài giảng để bắt đầu học</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{lectureStats.totalLectures}</p>
              <p className="text-gray-600 text-sm">Tổng bài giảng</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{lectureStats.completedLectures}</p>
              <p className="text-gray-600 text-sm">Đã hoàn thành</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{lectureStats.totalDuration}</p>
              <p className="text-gray-600 text-sm">Tổng thời lượng (phút)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{lectureStats.completionRate}%</p>
              <p className="text-gray-600 text-sm">Tỷ lệ hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Danh sách Bài giảng</h2>
        </div>
        
        <LectureList 
          lectures={lectures} 
          onLectureClick={handleLectureClick}
          loading={lecturesLoading}
        />
      </div>
      
      {lectures.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài giảng nào</h3>
          <p className="text-gray-600">Session này chưa có bài giảng nào để học.</p>
        </div>
      )}
    </div>
  );
};

export default LectureListPage;