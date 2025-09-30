import React from "react";
import { Lecture } from "../hook/useSession";
import { UUID } from "../utils/UUID";

interface LectureListProps {
  lectures: Lecture[];
  onLectureClick: (lectureId: UUID) => void;
  loading?: boolean;
}

const LectureList: React.FC<LectureListProps> = ({ 
  lectures, 
  onLectureClick, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54]"></div>
      </div>
    );
  }

  if (lectures.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài giảng nào</h3>
        <p className="text-gray-600">Session này chưa có bài giảng nào để học.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Danh sách Bài giảng</h2>
        <p className="text-sm text-gray-600 mt-1">{lectures.length} bài giảng</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {lectures.map((lecture, index) => {
          const progressPercentage = lecture.duration && lecture.duration > 0 
            ? Math.min(((lecture.watchTimeMinutes || 0) / lecture.duration) * 100, 100)
            : 0;

          return (
            <div
              key={lecture.lectureId}
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onLectureClick(lecture.lectureId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    lecture.isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : progressPercentage > 0
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {lecture.isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : progressPercentage > 0 ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Lecture Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{lecture.title}</h3>
                    {/* Progress Bar */}
                    {progressPercentage > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#106c54] h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Đã xem: {lecture.watchTimeMinutes || 0}/{lecture.duration} phút ({Math.round(progressPercentage)}%)
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2">
                      {/* Duration */}
                      {lecture.duration && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {lecture.duration} phút
                        </span>
                      )}
                      
                      {/* Status Badge */}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        lecture.isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : progressPercentage > 0
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lecture.isCompleted 
                          ? 'Đã hoàn thành' 
                          : progressPercentage > 0 
                          ? 'Đang học'
                          : 'Chưa bắt đầu'
                        }
                      </span>
                      
                      {/* Video indicator */}
                      {lecture.sourceUrl && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Video
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex items-center ml-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LectureList;