import React, { useState } from "react";
import { UUID } from "../utils/UUID";
import { useSessionsByCourse, useSessionStats, useLecturesBySession, useLectureStats } from "../hook/useSession";
import LectureList from "../component/LectureList";
import Progress from "./Progress";

interface SessionLearnProps {
    courseId: UUID;
    enrollmentId: UUID;
    userId: UUID;
    onBack: () => void;
}

const SessionLearn: React.FC<SessionLearnProps> = ({ courseId, enrollmentId, userId, onBack }) => {
  const [selectedSessionId, setSelectedSessionId] = useState<UUID | null>(null);
  const [selectedLectureId, setSelectedLectureId] = useState<UUID | null>(null);
  const [showLectures, setShowLectures] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  
  const { sessions, loading: sessionsLoading, error: sessionsError } = useSessionsByCourse(courseId, enrollmentId);
  console.log("Sessions:", sessions);
    const sessionStats = useSessionStats(courseId, enrollmentId);
  
  const { lectures, loading: lecturesLoading, error: lecturesError } = useLecturesBySession(selectedSessionId || undefined, enrollmentId);
  const lectureStats = useLectureStats(selectedSessionId || undefined, enrollmentId);

  const handleSessionClick = (sessionId: UUID) => {
    setSelectedSessionId(sessionId);
    setShowLectures(true);
  };

  const handleLectureClick = (lectureId: UUID) => {
    setSelectedLectureId(lectureId);
    setShowProgress(true);
  };

  const handleBackToSessions = () => {
    setShowLectures(false);
    setSelectedSessionId(null);
  };

  const handleBackToLectures = () => {
    setShowProgress(false);
    setSelectedLectureId(null);
  };

  if (showProgress) {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToLectures}
            className="flex items-center text-[#106c54] hover:text-[#0d5a47] mb-2"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách bài giảng
          </button>
        </div>
        {selectedLectureId && <Progress selectedLectureId={selectedLectureId} userId={userId} enrollmentId={enrollmentId }/>}
      </div>
    );
  }

  if (showLectures) {
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
            <h1 className="text-3xl font-bold text-gray-800">Bài giảng</h1>
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
        <LectureList 
          lectures={lectures} 
          onLectureClick={handleLectureClick}
          loading={lecturesLoading}
        />

        {lecturesError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="text-red-600">
              <p className="font-medium">Có lỗi xảy ra khi tải bài giảng</p>
              <p className="text-sm mt-1">{lecturesError}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (sessionsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54]"></div>
      </div>
    );
  }

  if (sessionsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-600">
          <p className="font-medium">Có lỗi xảy ra khi tải sessions</p>
          <p className="text-sm mt-1">{sessionsError}</p>
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
            onClick={onBack}
            className="flex items-center text-[#106c54] hover:text-[#0d5a47] mb-2"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại chi tiết khóa học
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Danh sách Sessions</h1>
          <p className="text-gray-600 mt-1">Chọn session để xem tiến độ học tập</p>
        </div>
      </div>

      {/* Sessions Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{sessionStats.totalSessions}</p>
              <p className="text-gray-600 text-sm">Tổng sessions</p>
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
              <p className="text-2xl font-bold text-gray-900">{sessionStats.completedSessions}</p>
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
              <p className="text-2xl font-bold text-gray-900">{sessionStats.totalDuration}</p>
              <p className="text-gray-600 text-sm">Tổng thời lượng (phút)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Danh sách Sessions</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sessions.map((session, index) => (
            <div
              key={session.sectionId}
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleSessionClick(session.sectionId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    session.isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {session.isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      {session.totalDuration && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {session.totalDuration} phút
                        </span>
                      )}
                      {session.lectureCount && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {session.lectureCount} bài giảng
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        session.isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {sessions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có session nào</h3>
          <p className="text-gray-600">Khóa học này chưa có session nào để học.</p>
        </div>
      )}
    </div>
  );
};

export default SessionLearn;