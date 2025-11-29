// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { UUID } from "../utils/UUID";
// import Progress from "./Progress";
// import { RootState } from "../../../app/store";
// import HomeLayout from "../../home/layout/HomeLayout";

// const ProgressPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { enrollmentId, courseId, sessionId, lectureId } = useParams<{
//     enrollmentId: string;
//     courseId: string;
//     sessionId: string;
//     lectureId: string;
//   }>();
//   const { user } = useSelector((state: RootState) => state.auth as { user: { id: UUID } | null });
//   const userId = user?.id;

//   const handleBackToLectures = () => {
//     navigate(`/learn/lectures/${enrollmentId}/${courseId}/${sessionId}`);
//   };

//   return (
//     <HomeLayout>
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <button
//           onClick={handleBackToLectures}
//           className="flex items-center text-[#106c54] hover:text-[#0d5a47] mb-4"
//         >
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           Quay lại danh sách bài giảng
//         </button>
//         <h1 className="text-3xl font-bold text-gray-800">Tiến độ học tập</h1>
//         <p className="text-gray-600 mt-1">Theo dõi quá trình học tập và làm quiz</p>
//       </div>

//       {/* Progress Component */}
//       {lectureId && userId && (
//         <Progress
//           selectedLectureId={lectureId as UUID}
//           userId={userId}
//           enrollmentId={enrollmentId as UUID}
//         />
//       )}
//       </div>
//       </HomeLayout>
//   );
// };

// export default ProgressPage;
export {};
