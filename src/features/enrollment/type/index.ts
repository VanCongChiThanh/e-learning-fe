import { UUID } from "../utils/UUID";

export interface Course {
  courseId: UUID;
  title: string;
  slug?: string;
  description?: string;
  price?: number;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  createdAt: string;
  category?: string;
  image?: string;
  level?: string;
  instructor?: {
    id: string;
    name: string;
  };
}

export interface Session {
  sectionId: UUID;
  courseId?: UUID;
  title: string;
  position: number;
  lectureCount?: number;
  totalDuration?: number;
  isCompleted?: boolean;
  completedLectureCount?: number;
}

export interface Lecture {
  lectureId: UUID;
  sectionId: UUID;
  title: string;
  sourceUrl?: string;
  type?: string;
  duration?: number;
  position: number;
  isCompleted?: boolean;
  watchTimeMinutes?: number;
}

export interface Enrollment {
  id: UUID;
  user: {
    userId: UUID;
    name: string;
  };
  course: Course;
  enrollmentDate: string;
  completionDate?: string;
  progressPercentage?: number;
  status?: string;
  totalWatchTimeMinutes?: number;
  lastAccessedAt?: string;
}

export interface EnrollmentWithStats {
  enrollmentId: UUID;
  userId: UUID;
  userEmail?: string;
  userFullName?: string;
  avatar?: string;
  courseId: UUID;
  courseTitle: string;
  enrollmentStatus: string;
  progressPercentage: number;
  totalWatchTimeMinutes: number;
  enrollmentDate: number;
  completionDate?: number;
  lastAccessedAt: number;
  totalQuizzes: number;
  completedQuizzes: number;
  passedQuizzes: number;
  averageQuizScore: number;
  totalAssignments: number;
  submittedAssignments: number;
  gradedAssignments: number;
  averageAssignmentScore: number;
  hasCertificate: boolean;
  certificateNumber?: string;
  certificateIssuedDate?: number;
}
export interface CourseStats {
  courseId: UUID;
  courseName: string;
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  averageProgress: number;
  totalWatchTime: number;
  completionRate: number;
  enrollments: EnrollmentWithStats[];
}

export interface CourseReport {
  averageQuizScore: number;
  completedEnrollments: number;
  averageProgress: number;
  totalWatchTime: number;
  totalEnrollments: number;
  averageAssignmentScore: number;
  certificatesIssued: number;
}

export interface Progress {
  id: UUID;
  enrollmentId: UUID;
  lectureId: UUID;
  isCompleted: boolean;
  watchTimeMinutes?: number;
  completionDate?: string;
}

// ==== QUIZ TYPES - Updated to match API ====
export interface QuizResponse {
  id: UUID;
  lectureId: UUID;
  title: string;
  description?: string;
  timeLimitMinutes?: number;
  passingScore?: number;
  maxAttempts?: number;
  numberQuestions?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface QuizQuestionCreateRequest {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
  sortOrder: number;
}

export interface QuizCreateRequest {
  lectureId: UUID;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  maxAttempts: number;
  isActive: boolean;
  questions: QuizQuestionCreateRequest[];
}

export interface QuizCreateResponse {
  id: UUID;
  lectureId: UUID;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  maxAttempts: number;
  numberQuestions: number;
  isActive: boolean | null;
  createdAt: number;
  questions: null;
}

// ==== QUIZ QUESTION TYPES ====
export interface QuizQuestionAnswerResponse {
  id: UUID;
  quizId: UUID;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
  sortOrder: number;
  createdAt: string;
}

// ==== QUIZ SUBMISSION TYPES ====
export interface QuizSubmissionRequest {
  quizId: UUID;
  enrollmentId: UUID;
  startedAt: string;
  answers: {
    questionId: UUID;
    selectedAnswerIndex: number;
  }[];
}

export interface QuizSubmissionResponse {
  id: UUID;
  quizId: UUID;
  quizTitle: string;
  userId: UUID;
  userEmail: string;
  attemptNumber: number;
  totalScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
  isPassed: boolean;
  startedAt: string;
  submittedAt: string;
  timeTakenMinutes: number;
  isCompleted: boolean;
  answers: {
    questionId: UUID;
    questionText: string;
    options: string[];
    selectedAnswerIndex: number;
    correctAnswerIndex: number;
    isCorrect: boolean;
    pointsEarned: number;
    maxPoints: number;
  }[];
}

// ==== FORM DATA TYPES FOR COMPONENTS ====
export interface QuizFormData {
  title: string;
  description: string;
  lectureId: string;
  maxAttempts: number;
  passingScore: number;
  timeLimitMinutes: number;
  isActive: boolean;
}

export interface QuestionFormData {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
  sortOrder: number;
}
export interface Student {
  id: UUID;
  email: string;
  fullName: string;
  enrollmentDate: string;
  progress: number;
  status: "ACTIVE" | "COMPLETED" | "INACTIVE";
  enrollmentData: EnrollmentWithStats;
}

export interface UserReport {
  totalAssignmentsSubmitted: number;
  totalEnrollments: number;
  totalQuizzesCompleted: number;
  completedCourses: number;
  totalQuizzesPassed: number;
  certificatesEarned: number;
  inProgressCourses: number;
  totalWatchTime: number;
}
