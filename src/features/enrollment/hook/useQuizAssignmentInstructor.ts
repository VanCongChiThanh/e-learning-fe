import { useState, useEffect } from 'react';
import { UUID } from 'crypto';
import { useQuizzesByLecture } from './useQuiz';
import { useAssignmentsByCourse } from './useAssignment';
import { useQuizStats, useAssignmentStats } from './useQuizAssignmentStats';
import { useInstructorCourses } from './useInstructorManager';
import { useSessionsByCourse } from './useSession';
import { useLecturesBySession } from './useSession';

export interface QuizData {
    lectureId?: UUID;
    title: string;
    description?: string;
    maxAttempts: number;
    passingScore: number;
    timeLimitMinutes: number;
    numberQuestions: number;
}

export interface AssignmentData {
    courseId?: UUID;
    title: string;
    description?: string;
    dueDate?: string;
}

export const useQuizAssignmentInstructor = (instructorId: UUID) => {
    // State management
    const [selectedCourseId, setSelectedCourseId] = useState<UUID | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<UUID | null>(null);
    const [selectedLectureId, setSelectedLectureId] = useState<UUID | null>(null);
    const [activeTab, setActiveTab] = useState<'quiz' | 'assignment'>('quiz');

    // Modal states
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [isQuizQuestionModalOpen, setIsQuizQuestionModalOpen] = useState(false);

    // Editing states
    const [editingQuiz, setEditingQuiz] = useState<any>(null);
    const [editingAssignment, setEditingAssignment] = useState<any>(null);
    const [selectedQuizForQuestions, setSelectedQuizForQuestions] = useState<UUID | null>(null);

    // Data hooks
    const {
        courses,
        loading: coursesLoading,
        error: coursesError,
        refetch: refetchCourses,
    } = useInstructorCourses(instructorId);

    const { sessions, loading: sessionsLoading, error: sessionsError } = useSessionsByCourse(selectedCourseId || undefined);
    const { lectures, loading: lecturesLoading, error: lecturesError } = useLecturesBySession(selectedSessionId || undefined);

    const {
        quizzes,
        loading: quizzesLoading,
        error: quizzesError,
        addQuiz,
        updateQuizById,
        removeQuiz
    } = useQuizzesByLecture(selectedLectureId || undefined);

    const {
        assignments,
        loading: assignmentsLoading,
        error: assignmentsError,
        addAssignment,
        updateAssignmentById,
        removeAssignment
    } = useAssignmentsByCourse(selectedCourseId || undefined);

    const { quizStats, loading: quizStatsLoading } = useQuizStats(quizzes);
    const { assignmentStats, loading: assignmentStatsLoading } = useAssignmentStats(assignments);

    // Computed values
    const loading = quizzesLoading || assignmentsLoading || quizStatsLoading || assignmentStatsLoading;
    const totalQuizzes = quizzes.length;
    const totalAssignments = assignments.length;
    const totalQuizAttempts = Object.values(quizStats).reduce((sum: number, stat: any) => sum + (stat.totalAttempts || 0), 0);
    const totalSubmissions = Object.values(assignmentStats).reduce((sum: number, stat: any) => sum + (stat.totalSubmissions || 0), 0);

    // Effects for resetting selections
    useEffect(() => {
        if (selectedCourseId) {
            setSelectedSessionId(null);
            setSelectedLectureId(null);
        }
    }, [selectedCourseId]);

    useEffect(() => {
        if (selectedSessionId) {
            setSelectedLectureId(null);
        }
    }, [selectedSessionId]);

    // Quiz handlers
    const handleCreateQuiz = async (data: QuizData) => {
        if (!selectedCourseId || !selectedSessionId || !selectedLectureId) {
            throw new Error('Vui lòng chọn đầy đủ khóa học, chương và bài giảng trước khi tạo quiz');
        }

        try {
            await addQuiz({
                ...data,
                lectureId: selectedLectureId
            });
            return { success: true, message: 'Tạo quiz thành công!' };
        } catch (error) {
            console.error('Error creating quiz:', error);
            throw new Error('Có lỗi xảy ra khi tạo quiz');
        }
    };

    const handleEditQuiz = (quizId: UUID) => {
        const quiz = quizzes.find(q => q.id === quizId);
        if (quiz) {
            setEditingQuiz(quiz);
            setIsQuizModalOpen(true);
        }
    };

    const handleUpdateQuiz = async (data: QuizData) => {
        if (!editingQuiz) throw new Error('Không tìm thấy quiz để cập nhật');

        try {
            const updateData: any = {};

            if (data.title !== editingQuiz.title) {
                updateData.title = data.title;
            }

            if (data.description !== editingQuiz.description) {
                updateData.description = data.description;
            }

            if (data.maxAttempts !== editingQuiz.maxAttempts) {
                updateData.maxAttempts = data.maxAttempts;
            }

            if (data.passingScore !== editingQuiz.passingScore) {
                updateData.passingScore = data.passingScore;
            }

            if (data.timeLimitMinutes !== editingQuiz.timeLimitMinutes) {
                updateData.timeLimitMinutes = data.timeLimitMinutes;
            }

            if (data.numberQuestions !== editingQuiz.numberQuestions) {
                updateData.numberQuestions = data.numberQuestions;
            }

            if (Object.keys(updateData).length === 0) {
                throw new Error('Không có thay đổi nào để cập nhật');
            }

            await updateQuizById(editingQuiz.id, updateData);
            setEditingQuiz(null);
            return { success: true, message: 'Cập nhật quiz thành công!' };
        } catch (error) {
            console.error('Error updating quiz:', error);
            throw new Error('Có lỗi xảy ra khi cập nhật quiz');
        }
    };

    const handleDeleteQuiz = async (quizId: UUID) => {
        try {
            await removeQuiz(quizId);
            return { success: true, message: 'Xóa quiz thành công!' };
        } catch (error) {
            console.error('Error deleting quiz:', error);
            throw new Error('Có lỗi xảy ra khi xóa quiz');
        }
    };

    const handleManageQuestions = (quizId: UUID) => {
        setSelectedQuizForQuestions(quizId);
        setIsQuizQuestionModalOpen(true);
    };

    // Assignment handlers
    const handleCreateAssignment = async (data: AssignmentData) => {
        if (!selectedCourseId) {
            throw new Error('Vui lòng chọn khóa học trước khi tạo bài tập');
        }

        try {
            let formattedDueDate: string | undefined = undefined;

            if (data.dueDate) {
                formattedDueDate = new Date(data.dueDate).toISOString();
            }

            await addAssignment({
                ...data,
                courseId: selectedCourseId,
                dueDate: formattedDueDate,
            });

            return { success: true, message: 'Tạo bài tập thành công!' };
        } catch (error) {
            console.error('Error creating assignment:', error);
            throw new Error('Có lỗi xảy ra khi tạo bài tập: ' + ((error as any)?.message || 'Unknown error'));
        }
    };

    const handleUpdateAssignment = async (data: AssignmentData) => {
        if (!editingAssignment) throw new Error('Không tìm thấy bài tập để cập nhật');

        try {
            const updateData: any = {};

            if (data.title !== editingAssignment.title) {
                updateData.title = data.title;
            }

            if (data.description !== editingAssignment.description) {
                updateData.description = data.description;
            }

            if (data.dueDate) {
                const formattedDueDate = new Date(data.dueDate).toISOString();
                if (formattedDueDate !== editingAssignment.dueDate) {
                    updateData.dueDate = formattedDueDate;
                }
            } else if (editingAssignment.dueDate) {
                updateData.dueDate = null;
            }

            if (Object.keys(updateData).length === 0) {
                throw new Error('Không có thay đổi nào để cập nhật');
            }

            await updateAssignmentById(editingAssignment.id, updateData);
            setEditingAssignment(null);
            return { success: true, message: 'Cập nhật bài tập thành công!' };
        } catch (error) {
            console.error('Error updating assignment:', error);
            throw new Error('Có lỗi xảy ra khi cập nhật bài tập');
        }
    };

    const handleEditAssignment = (assignmentId: UUID) => {
        const foundAssignment = assignments.find(a => a.id === assignmentId);
        if (foundAssignment) {
            setEditingAssignment(foundAssignment);
            setIsAssignmentModalOpen(true);
        }
    };

    const handleDeleteAssignment = async (assignmentId: UUID) => {
        try {
            await removeAssignment(assignmentId);
            return { success: true, message: 'Xóa bài tập thành công!' };
        } catch (error) {
            console.error('Error deleting assignment:', error);
            throw new Error('Có lỗi xảy ra khi xóa bài tập');
        }
    };

    // Utility handlers
    const handleViewQuizStats = (quizId: UUID) => {
        console.log('View quiz stats for:', quizId);
    };

    const handleViewAssignmentSubmissions = (assignmentId: UUID) => {
        console.log('View assignment submissions for:', assignmentId);
    };

    // Modal handlers
    const openQuizModal = (quiz?: any) => {
        setEditingQuiz(quiz || null);
        setIsQuizModalOpen(true);
    };

    const closeQuizModal = () => {
        setIsQuizModalOpen(false);
        setEditingQuiz(null);
    };

    const openAssignmentModal = (assignment?: any) => {
        setEditingAssignment(assignment || null);
        setIsAssignmentModalOpen(true);
    };

    const closeAssignmentModal = () => {
        setIsAssignmentModalOpen(false);
        setEditingAssignment(null);
    };

    const closeQuizQuestionModal = () => {
        setIsQuizQuestionModalOpen(false);
        setSelectedQuizForQuestions(null);
    };

    return {
        // State
        selectedCourseId,
        setSelectedCourseId,
        selectedSessionId,
        setSelectedSessionId,
        selectedLectureId,
        setSelectedLectureId,
        activeTab,
        setActiveTab,

        // Modal states
        isQuizModalOpen,
        isAssignmentModalOpen,
        isQuizQuestionModalOpen,
        editingQuiz,
        editingAssignment,
        selectedQuizForQuestions,

        // Data
        courses,
        sessions,
        lectures,
        quizzes,
        assignments,
        quizStats,
        assignmentStats,

        // Loading states
        loading,
        coursesLoading,
        sessionsLoading,
        lecturesLoading,
        quizzesLoading,
        assignmentsLoading,

        // Error states
        coursesError,
        sessionsError,
        lecturesError,
        quizzesError,
        assignmentsError,

        // Computed values
        totalQuizzes,
        totalAssignments,
        totalQuizAttempts,
        totalSubmissions,

        // Quiz handlers
        handleCreateQuiz,
        handleEditQuiz,
        handleUpdateQuiz,
        handleDeleteQuiz,
        handleManageQuestions,
        handleViewQuizStats,

        // Assignment handlers
        handleCreateAssignment,
        handleUpdateAssignment,
        handleEditAssignment,
        handleDeleteAssignment,
        handleViewAssignmentSubmissions,

        // Modal handlers
        openQuizModal,
        closeQuizModal,
        openAssignmentModal,
        closeAssignmentModal,
        closeQuizQuestionModal,

        // Utility functions
        refetchCourses,
    };
};