// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { UUID } from "../utils/UUID";
// import { useLecturesBySession, useLectureStats } from "../hook/useSession";
// import LectureList from "../component/LectureList";
// import HomeLayout from "../../home/layout/HomeLayout";

// const LectureListPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { enrollmentId, courseId, sessionId } = useParams<{
//     enrollmentId: string;
//     courseId: string;
//     sessionId: string;
//   }>();
  
//   const { lectures, loading: lecturesLoading, error: lecturesError } = useLecturesBySession(sessionId as UUID, enrollmentId as UUID);
//   const lectureStats = useLectureStats(sessionId as UUID, enrollmentId as UUID);

//   const handleLectureClick = (lectureId: UUID) => {
//     navigate(`/learn/progress/${enrollmentId}/${courseId}/${sessionId}/${lectureId}`);
//   };

//   const handleBackToSessions = () => {
//     navigate(`/learn/sessions/${enrollmentId}/${courseId}`);
//   };

//   if (lecturesLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[200px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54]"></div>
//       </div>
//     );
//   }

//   if (lecturesError) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//         <div className="text-red-600">
//           <p className="font-medium">Có lỗi xảy ra khi tải bài giảng</p>
//           <p className="text-sm mt-1">{lecturesError}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <HomeLayout>
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <button
//             onClick={handleBackToSessions}
//             className="flex items-center text-[#106c54] hover:text-[#0d5a47] mb-2"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Quay lại danh sách sessions
//           </button>
//           <h1 className="text-3xl font-bold text-gray-800">Danh sách Bài giảng</h1>
//           <p className="text-gray-600 mt-1">Chọn bài giảng để bắt đầu học</p>
//         </div>
//       </div>

//       {/* Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow-sm border p-4">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-blue-100 text-blue-600">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{lectureStats.totalLectures}</p>
//               <p className="text-gray-600 text-sm">Tổng bài giảng</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-sm border p-4">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-green-100 text-green-600">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{lectureStats.completedLectures}</p>
//               <p className="text-gray-600 text-sm">Đã hoàn thành</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-sm border p-4">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-orange-100 text-orange-600">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{lectureStats.totalDuration}</p>
//               <p className="text-gray-600 text-sm">Tổng thời lượng (phút)</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border p-4">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-purple-100 text-purple-600">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-2xl font-bold text-gray-900">{lectureStats.completionRate}%</p>
//               <p className="text-gray-600 text-sm">Tỷ lệ hoàn thành</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Lectures List */}
//       <div className="bg-white rounded-lg shadow-sm border">
//         <LectureList
//           lectures={lectures}
//           onLectureClick={handleLectureClick}
//           loading={lecturesLoading}
//         />
//       </div>
      
//       {lectures.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-gray-400 mb-4">
//             <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài giảng nào</h3>
//           <p className="text-gray-600">Session này chưa có bài giảng nào để học.</p>
//         </div>
//       )}
//     </div>
//     </HomeLayout>
//   );
// };

// export default LectureListPage;



import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UUID } from "../utils/UUID";
import { useLecturesBySession, useLectureStats } from "../hook/useSession";
import LectureList from "../component/LectureList";
import HomeLayout from "../../home/layout/HomeLayout";

// --- COMPONENT CON: THẺ TIẾN ĐỘ (MỚI) ---
// Thay thế cho 4 thẻ thống kê cũ
const SessionProgressCard = ({ stats }: { stats: any }) => {
  const { 
    totalLectures = 0, 
    completedLectures = 0, 
    totalDuration = 0, 
    completionRate = 0 
  } = stats;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
      {/* Tiêu đề và Tỷ lệ % */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Tiến độ Session</h2>
        <span className="text-2xl font-bold text-[#106c54]">{completionRate}%</span>
      </div>
      
      {/* Thanh tiến độ */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-[#106c54] h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${completionRate}%` }}
        ></div>
      </div>

      {/* Các số liệu chi tiết */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center md:text-left">
        <div className="md:border-r border-gray-100 pr-4">
          <p className="text-gray-500 text-sm">Bài giảng</p>
          <p className="text-lg font-semibold text-gray-900">{completedLectures} / {totalLectures}</p>
        </div>
        <div className="md:border-r border-gray-100 pr-4">
          <p className="text-gray-500 text-sm">Thời lượng</p>
          <p className="text-lg font-semibold text-gray-900">{totalDuration} <span className="text-sm font-normal">phút</span></p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <p className="text-gray-500 text-sm">Trạng thái</p>
          <p className="text-lg font-semibold text-gray-900">
            {completionRate === 100 ? 'Đã hoàn thành' : 'Đang học'}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CON: SKELETON LOADING (MỚI) ---
const LecturePageSkeleton = () => (
  <HomeLayout>
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      {/* Skeleton for Header */}
      <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>

      {/* Skeleton for Progress Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-3">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-8 bg-gray-300 rounded w-1/5"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
      
      {/* Skeleton for Lecture List */}
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-5 border-b border-gray-100">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
            <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
          </div>
        ))}
      </div>

    </div>
  </HomeLayout>
);

// --- COMPONENT CHÍNH (ĐÃ CẬP NHẬT) ---
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
    navigate(`/learn/progress/${enrollmentId}/${courseId}/${sessionId}/${lectureId}`);
  };

  const handleBackToSessions = () => {
    navigate(`/learn/sessions/${enrollmentId}/${courseId}`);
  };

  // --- TRẠNG THÁI LOADING (CẬP NHẬT) ---
  // Giả sử lectureStats cũng có cờ loading, hoặc chúng ta chỉ dựa vào lecturesLoading
  if (lecturesLoading) {
    return <LecturePageSkeleton />;
  }

  // --- TRẠNG THÁI LỖI (CẬP NHẬT) ---
  if (lecturesError) {
    return (
      <HomeLayout>
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex">
              <div className="text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Có lỗi xảy ra khi tải bài giảng</h3>
                <p className="mt-1 text-sm text-red-700">{lecturesError}</p>
              </div>
            </div>
          </div>
        </div>
      </HomeLayout>
    );
  }

  // --- GIAO DIỆN CHÍNH (CẬP NHẬT) ---
  return (
    <HomeLayout>
        <div className="min-h-screen bg-gray-100 p-6">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleBackToSessions}
              className="flex items-center text-sm text-[#106c54] font-medium hover:text-[#0d5a47] mb-2"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại danh sách sessions
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Bài giảng</h1>
            {/* Bạn có thể thêm tên session ở đây nếu có */}
            {/* <p className="text-gray-600 mt-1">Session: {sessionName}</p> */}
          </div>

          {/* Thẻ tiến độ MỚI */}
          <SessionProgressCard stats={lectureStats} />

          {/* Tiêu đề danh sách */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Danh sách bài giảng</h2>

          {/* Lectures List */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
            {lectures.length > 0 ? (
              <LectureList
                lectures={lectures}
                onLectureClick={handleLectureClick}
                // loading prop có thể không cần nữa vì đã xử lý ở cấp trang
              />
            ) : (
              // Trạng thái trống
              <div className="text-center py-16">
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
        </div>
    </HomeLayout>
  );
};

export default LectureListPage;