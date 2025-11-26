// import { useState, useEffect } from "react";
// import { UUID } from "crypto";
// import { useQuizStats } from "./useQuizAssignmentStats";
// import { useInstructorCourses } from "./useInstructorManager";
// import { useSessionsByCourse } from "./useSession";
// import { useLecturesBySession } from "./useSession";
// import { QuizRequest as QuizData } from "../type";

// export const useQuizAssignmentInstructor = (instructorId: UUID) => {
//   // State management
//   const [selectedCourseId, setSelectedCourseId] = useState<UUID | null>(null);
//   const [selectedSessionId, setSelectedSessionId] = useState<UUID | null>(null);
//   const [selectedLectureId, setSelectedLectureId] = useState<UUID | null>(null);
//   const [activeTab, setActiveTab] = useState<"quiz" | "assignment">("quiz");

//   // Modal states
//   const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
//   const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
//   const [isQuizQuestionModalOpen, setIsQuizQuestionModalOpen] = useState(false);

//   // Editing states
//   const [editingQuiz, setEditingQuiz] = useState<any>(null);
//   const [editingAssignment, setEditingAssignment] = useState<any>(null);
//   const [selectedQuizForQuestions, setSelectedQuizForQuestions] =
//     useState<UUID | null>(null);

//   // Data hooks
//   const {
//     courses,
//     loading: coursesLoading,
//     error: coursesError,
//     refetch: refetchCourses,
//   } = useInstructorCourses(instructorId);

//   const {
//     sessions,
//     loading: sessionsLoading,
//     error: sessionsError,
//   } = useSessionsByCourse(selectedCourseId || undefined);
//   const {
//     lectures,
//     loading: lecturesLoading,
//     error: lecturesError,
//   } = useLecturesBySession(selectedSessionId || undefined);

//   const {
//     quizzes,
//     loading: quizzesLoading,
//     error: quizzesError,
//     updateQuizById,
//     removeQuiz,
//   } = useQuizzesByLecture(selectedLectureId || undefined);

//   const { quizStats, loading: quizStatsLoading } = useQuizStats(quizzes);

//   // Computed values
//   const loading = quizzesLoading || quizStatsLoading;
//   const totalQuizzes = quizzes.length;
//   const totalQuizAttempts = Object.values(quizStats).reduce(
//     (sum: number, stat: any) => sum + (stat.totalAttempts || 0),
//     0
//   );

//   // Effects for resetting selections
//   useEffect(() => {
//     if (selectedCourseId) {
//       setSelectedSessionId(null);
//       setSelectedLectureId(null);
//     }
//   }, [selectedCourseId]);

//   useEffect(() => {
//     if (selectedSessionId) {
//       setSelectedLectureId(null);
//     }
//   }, [selectedSessionId]);
//   const handleEditQuiz = (quizId: UUID) => {
//     const quiz = quizzes.find((q) => q.id === quizId);
//     if (quiz) {
//       setEditingQuiz(quiz);
//       setIsQuizModalOpen(true);
//     }
//   };

//   const handleUpdateQuiz = async (data: QuizData) => {
//     if (!editingQuiz) throw new Error("Không tìm thấy quiz để cập nhật");

//     try {
//       const updateData: any = {};

//       if (data.title !== editingQuiz.title) {
//         updateData.title = data.title;
//       }

//       if (data.description !== editingQuiz.description) {
//         updateData.description = data.description;
//       }

//       if (data.maxAttempts !== editingQuiz.maxAttempts) {
//         updateData.maxAttempts = data.maxAttempts;
//       }

//       if (data.passingScore !== editingQuiz.passingScore) {
//         updateData.passingScore = data.passingScore;
//       }

//       if (data.timeLimitMinutes !== editingQuiz.timeLimitMinutes) {
//         updateData.timeLimitMinutes = data.timeLimitMinutes;
//       }

//       if (data.numberQuestions !== editingQuiz.numberQuestions) {
//         updateData.numberQuestions = data.numberQuestions;
//       }

//       if (Object.keys(updateData).length === 0) {
//         throw new Error("Không có thay đổi nào để cập nhật");
//       }

//       await updateQuizById(editingQuiz.id, updateData);
//       setEditingQuiz(null);
//       return { success: true, message: "Cập nhật quiz thành công!" };
//     } catch (error) {
//       console.error("Error updating quiz:", error);
//       throw new Error("Có lỗi xảy ra khi cập nhật quiz");
//     }
//   };

//   const handleDeleteQuiz = async (quizId: UUID) => {
//     try {
//       await removeQuiz(quizId);
//       return { success: true, message: "Xóa quiz thành công!" };
//     } catch (error) {
//       console.error("Error deleting quiz:", error);
//       throw new Error("Có lỗi xảy ra khi xóa quiz");
//     }
//   };

//   const handleManageQuestions = (quizId: UUID) => {
//     setSelectedQuizForQuestions(quizId);
//     setIsQuizQuestionModalOpen(true);
//   };

//   // Utility handlers
//   const handleViewQuizStats = (quizId: UUID) => {
//     console.log("View quiz stats for:", quizId);
//   };

//   // Modal handlers
//   const openQuizModal = (quiz?: any) => {
//     setEditingQuiz(quiz || null);
//     setIsQuizModalOpen(true);
//   };

//   const closeQuizModal = () => {
//     setIsQuizModalOpen(false);
//     setEditingQuiz(null);
//   };

//   const openAssignmentModal = (assignment?: any) => {
//     setEditingAssignment(assignment || null);
//     setIsAssignmentModalOpen(true);
//   };

//   const closeAssignmentModal = () => {
//     setIsAssignmentModalOpen(false);
//     setEditingAssignment(null);
//   };

//   const closeQuizQuestionModal = () => {
//     setIsQuizQuestionModalOpen(false);
//     setSelectedQuizForQuestions(null);
//   };

//   return {
//     // State
//     selectedCourseId,
//     setSelectedCourseId,
//     selectedSessionId,
//     setSelectedSessionId,
//     selectedLectureId,
//     setSelectedLectureId,
//     activeTab,
//     setActiveTab,

//     // Modal states
//     isQuizModalOpen,
//     isAssignmentModalOpen,
//     isQuizQuestionModalOpen,
//     editingQuiz,
//     editingAssignment,
//     selectedQuizForQuestions,

//     // Data
//     courses,
//     sessions,
//     lectures,
//     quizzes,
//     quizStats,

//     // Loading states
//     loading,
//     coursesLoading,
//     sessionsLoading,
//     lecturesLoading,
//     quizzesLoading,

//     // Error states
//     coursesError,
//     sessionsError,
//     lecturesError,
//     quizzesError,

//     // Computed values
//     totalQuizzes,
//     totalQuizAttempts,

//     handleEditQuiz,
//     handleUpdateQuiz,
//     handleDeleteQuiz,
//     handleManageQuestions,
//     handleViewQuizStats,
//     // Modal handlers
//     openQuizModal,
//     closeQuizModal,
//     openAssignmentModal,
//     closeAssignmentModal,
//     closeQuizQuestionModal,

//     // Utility functions
//     refetchCourses,
//   };
// };
export {};
