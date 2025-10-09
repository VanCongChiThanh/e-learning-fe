import { UUID } from "../utils/UUID";

export interface Course {
    courseId: UUID;
    title: string;
    description?: string;
    instructorId: UUID;
    category?: string;
    level?: string;
    language?: string;
    price?: number;
    discountPrice?: number;
    isPublished?: boolean;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    image?: string;
}

export interface Section {
    sectionId: UUID;
    course: Course;
    title: string;
    position?: number;
}

export interface Lecture {
    lectureId: UUID;
    section: Section;
    title: string;
    type: "video" | "article" | "quiz" | "assignment";
    sourceUrl?: string;
    duration?: number;
    position?: number;
}

export interface Enrollment {
    id: UUID;
    userId: UUID;
    course: Course;
    enrolledAt: string;
    completionDate?: string;
    progress?: number; // percentage of course completed
    status?: string;
    totalWatchTimeMinutes?: number;
    lastAccessedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface EnrollmentRequest {
    userId?: UUID;
    courseId?: UUID;
    progressPercentage?: string;
    status?: string;
    completionDate?: string;
    totalWatchTimeMinutes?: string;
    lastAccessedAt?: string;
}

export interface Progress {
    id: UUID;
    enrollmentId: UUID;
    lectureId: UUID;
    isCompleted: boolean;
    watchTimeMinutes?: number;
}

export interface ProgressRequest {
    enrollmentId?: UUID;
    lectureId?: UUID;
    isCompleted?: boolean;
    watchTimeMinutes?: number;
    completionDate?: string;
}

export interface Quiz {
    id: UUID;
    title: string;
    description?: string;
    lectureId: UUID;
    maxAttempts?: number;
    passingScore?: number;
    timeLimitMinutes?: number;
    numberQuestions?: number;
    createdAt?: string;
}

export interface QuizRequest {
    title?: string;
    description?: string;
    lectureId?: UUID;
    maxAttempts?: number;
    passingScore?: number;
    timeLimitMinutes?: number;
    numberQuestions?: number;
}

export interface QuizQuestion {
    id: UUID;
    quiz: Quiz;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: "A" | "B" | "C" | "D";
    points?: number;
    sortOrder?: number;
    createdAt?: string;
}

export interface QuizQuestionRequest {
    // quizId?: UUID;
    questionText?: string;
    optionA?: string;
    optionB?: string;
    optionC?: string;
    optionD?: string;
    correctAnswer?: "A" | "B" | "C" | "D";
    points?: number;
    sortOrder?: number;
}

export interface QuizAttempt {
    id: UUID;
    quiz: Quiz;
    userId: UUID;
    enrollment: Enrollment;
    question: QuizQuestion;
    selectedOption: string;
    isCorrect: boolean;
    point: number;
    attemptNumber: number;
    startedAt: string;
    submittedAt?: string;
    timeSpentMinutes?: number;
}

export interface QuizAttemptRequest {
    quiz: Quiz
    userId: UUID
    enrollment: Enrollment
    question: QuizQuestion
    selectedOption: string
    pointsEarned: number
    attemptNumber: number
    timeTakenMinutes: number
}

