// Main quiz operations hook - combines all quiz functionality
export {
  useCreateQuizWithQuestions,
  useQuizById,
  useQuizzesByLecture,
  useQuizQuestions,
  useQuizQuestion,
  useUpdateQuiz,
  useDeleteQuiz,
  useUpdateQuizQuestion,
  useDeleteQuizQuestion,
  useSubmitQuiz,
  useQuizTaking,
} from "./useQuizOperations";

// Other existing hooks
export * from "./useEnrollment";
export * from "./useEnrollmentManager";
export * from "./useInstructorManager";
export * from "./useLectures";
export * from "./useProgress";
// export * from "./useQuizAssignmentInstructor";
export * from "./useQuizAssignmentStats";
