import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UUID } from "../utils/UUID";
import { useSessionsByCourse, useSessionStats } from "../hook/useSession";
import HomeLayout from "../../home/layout/HomeLayout";

const SessionListPage: React.FC = () => {
  const navigate = useNavigate();
  const { enrollmentId, courseId } = useParams<{
    enrollmentId: string;
    courseId: string;
  }>();

  const {
    sessions,
    loading: sessionsLoading,
    error: sessionsError,
  } = useSessionsByCourse(courseId as UUID, enrollmentId as UUID);
  const sessionStats = useSessionStats(courseId as UUID, enrollmentId as UUID);

  const handleSessionClick = (sessionId: UUID) => {
    navigate(`/learn/lectures/${enrollmentId}/${courseId}/${sessionId}`);
  };

  const handleBackToEnrollments = () => {
    navigate("/learn/enrollments");
  };

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
    <HomeLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={handleBackToEnrollments}
              className="flex items-center text-[#106c54] hover:text-[#0d5a47] mb-2"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Quay lại danh sách khóa học
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Danh sách Sessions
            </h1>
            <p className="text-gray-600 mt-1">
              Chọn session để xem các bài giảng
            </p>
          </div>
        </div>

        {/* Sessions Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {sessionStats.totalSessions}
                </p>
                <p className="text-gray-600 text-sm">Tổng sessions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {sessionStats.completedSessions}
                </p>
                <p className="text-gray-600 text-sm">Đã hoàn thành</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {sessionStats.totalDuration}
                </p>
                <p className="text-gray-600 text-sm">Tổng thời lượng (phút)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách Sessions
            </h2>
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
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        session.isCompleted
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {session.isCompleted ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {session.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            session.isCompleted
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {session.isCompleted
                            ? "Đã hoàn thành"
                            : "Chưa hoàn thành"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
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
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có session nào
            </h3>
            <p className="text-gray-600">
              Khóa học này chưa có session nào để học.
            </p>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default SessionListPage;

/**
 * import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UUID } from "../utils/UUID";
import { useSessionsByCourse, useSessionStats } from "../hook/useSession";

// --- COMPONENT CON: THẺ TIẾN ĐỘ ---
// Component này thay thế 3 thẻ thống kê cũ
const CourseProgressCard = ({ stats }: { stats: { totalSessions: number, completedSessions: number, totalDuration: string | number } }) => {
  const { totalSessions, completedSessions, totalDuration } = stats;
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Cột trái: Thông tin tiến độ */
//         <div className="mb-4 md:mb-0">
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Tiến độ khóa học</h2>
//           <p className="text-3xl font-bold text-[#106c54]">
//             {completedSessions} / {totalSessions}
//             <span className="text-xl font-medium text-gray-600 ml-2">Sessions</span>
//           </p>
//           <p className="text-sm text-gray-500 mt-1">Tổng thời lượng: {totalDuration} phút</p>
//         </div>

//         {/* Cột phải: Thanh tiến độ */}
//         <div className="w-full md:w-1/3">
//           <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-1">
//             <span>Tiến độ</span>
//             <span>{Math.round(progressPercentage)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div
//               className="bg-[#106c54] h-2.5 rounded-full transition-all duration-500"
//               style={{ width: `${progressPercentage}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- COMPONENT CON: MỘT MỤC SESSION TRONG DANH SÁCH ---
// // Component này đại diện cho 1 session trong timeline
// const SessionItem = ({ session, status, index, onClick }: { session: any, status: 'completed' | 'current' | 'upcoming', index: number, onClick: () => void }) => {

//   // Định nghĩa style dựa trên trạng thái
//   let iconBg = "bg-gray-300";
//   let iconContent: React.ReactNode = <span className="font-semibold text-gray-600 text-sm">{index + 1}</span>;
//   let titleColor = "text-gray-500";
//   let cursor = "cursor-default";
//   let hoverBg = "hover:bg-gray-50";

//   if (status === 'completed') {
//     iconBg = "bg-green-100 text-green-600";
//     iconContent = (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//       </svg>
//     );
//     titleColor = "text-gray-800";
//     cursor = "cursor-pointer";
//   } else if (status === 'current') {
//     iconBg = "bg-blue-100 text-blue-600";
//     iconContent = (
//       // Hiệu ứng "pulse" cho session hiện tại
//       <span className="relative flex h-3 w-3">
//         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//         <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
//       </span>
//     );
//     titleColor = "text-gray-900 font-semibold";
//     cursor = "cursor-pointer";
//   }

//   return (
//     <div className={`flex items-start space-x-4 p-5 transition-colors ${cursor} ${hoverBg} ${status !== 'upcoming' ? '' : 'opacity-60'}`} onClick={onClick}>
//       {/* Icon trạng thái */}
//       <div className={`relative w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${iconBg} mt-1`}>
//         {iconContent}
//       </div>

//       {/* Nội dung text */}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-gray-500">Session {index + 1}</p>
//             <h3 className={`text-lg ${titleColor} truncate`}>{session.title}</h3>
//           </div>
//           {/* Icon mũi tên (chỉ hiển thị cho các session có thể click) */}
//           {status !== 'upcoming' && (
//              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//              </svg>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- COMPONENT CON: SKELETON LOADING ---
// const SessionPageSkeleton = () => (
//   <div className="max-w-4xl mx-auto p-6 animate-pulse">
//     {/* Skeleton for Header */}
//     <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
//     <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>

//     {/* Skeleton for Progress Card */}
//     <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <div className="w-full md:w-1/2 mb-4 md:mb-0">
//           <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div>
//           <div className="h-10 bg-gray-300 rounded w-1/2 mb-2"></div>
//           <div className="h-4 bg-gray-300 rounded w-1/4"></div>
//         </div>
//         <div className="w-full md:w-1/3">
//           <div className="h-10 bg-gray-300 rounded-lg"></div>
//         </div>
//       </div>
//     </div>

//     {/* Skeleton for Session List */}
//     <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden divide-y divide-gray-100">
//       {[...Array(4)].map((_, i) => (
//         <div key={i} className="flex items-start space-x-4 p-5">
//           <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 mt-1"></div>
//           <div className="flex-1 space-y-3 py-1">
//             <div className="h-4 bg-gray-300 rounded w-1/4"></div>
//             <div className="h-5 bg-gray-300 rounded w-3/4"></div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// // --- COMPONENT CHÍNH ---
// const SessionListPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { enrollmentId, courseId } = useParams<{ enrollmentId: string; courseId: string }>();

//   const { sessions, loading: sessionsLoading, error: sessionsError } = useSessionsByCourse(courseId as UUID, enrollmentId as UUID);
//   const sessionStats = useSessionStats(courseId as UUID, enrollmentId as UUID);

//   const handleSessionClick = (sessionId: UUID, isUpcoming: boolean) => {
//     // Chỉ cho phép click vào session đã hoàn thành hoặc hiện tại
//     if (isUpcoming) return;
//     navigate(`/learn/lectures/${enrollmentId}/${courseId}/${sessionId}`);
//   };

//   const handleBackToEnrollments = () => {
//     navigate('/learn/enrollments');
//   };

//   // --- TRẠNG THÁI LOADING ---
//   if (sessionsLoading) {
//     return <SessionPageSkeleton />;
//   }

//   // --- TRẠNG THÁI LỖI ---
//   if (sessionsError) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//           <div className="flex">
//             <div className="text-red-600">
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-red-800">Có lỗi xảy ra khi tải nội dung khóa học</h3>
//               <p className="mt-1 text-sm text-red-700">{sessionsError}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Tìm session "hiện tại" (session đầu tiên chưa hoàn thành)
//   const currentIndex = sessions.findIndex(s => !s.isCompleted);

//   return (
//     <div className="bg-gray-50 min-h-screen py-8">
//       <div className="max-w-4xl mx-auto p-6">
//         {/* Header */}
//         <div className="mb-6">
//           <button
//             onClick={handleBackToEnrollments}
//             className="flex items-center text-sm text-[#106c54] font-medium hover:text-[#0d5a47] mb-2"
//           >
//             <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Quay lại danh sách khóa học
//           </button>
//           <h1 className="text-3xl font-bold text-gray-800">Nội dung khóa học</h1>
//           {/* Bạn có thể thêm tên khóa học ở đây nếu có */}
//           {/* <p className="text-gray-600 mt-1">Khóa học: {courseName}</p> */}
//         </div>

//         {/* Thẻ tiến độ MỚI */}
//         <CourseProgressCard stats={sessionStats} />

//         {/* Danh sách Sessions (Timeline) MỚI */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//           {sessions.length > 0 ? (
//             <div className="divide-y divide-gray-100">
//               {sessions.map((session, index) => {
//                 // Xác định trạng thái của session
//                 let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
//                 if (session.isCompleted) {
//                   status = 'completed';
//                 } else if (index === currentIndex || (currentIndex === -1 && index === sessions.length - 1)) {
//                   // 'current' là session đầu tiên chưa hoàn thành,
//                   // hoặc là session cuối cùng nếu tất cả đã hoàn thành
//                   status = 'current';
//                 }

//                 return (
//                   <SessionItem
//                     key={session.sectionId}
//                     session={session}
//                     status={status}
//                     index={index}
//                     onClick={() => handleSessionClick(session.sectionId, status === 'upcoming')}
//                   />
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-16">
//               <div className="text-gray-400 mb-4">
//                 <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có session nào</h3>
//               <p className="text-gray-600">Khóa học này chưa có session nào để học.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SessionListPage;
//  */
