import { useState, useMemo } from "react";
import { useEnrollments } from "./useEnrollment";

export const useEnrollmentManager = () => {
  const [filterUserId, setFilterUserId] = useState("");
  const [filterCourseId, setFilterCourseId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [editData, setEditData] = useState({
    progressPercentage: "",
    status: "",
    totalWatchTimeMinutes: "",
  });

  const { enrollments, loading, error, fetchEnrollments } = useEnrollments();
  const filteredEnrollments = useMemo(() => {
    if (!enrollments) return [];

    return enrollments.filter((enrollment: any) => {
      const matchesSearch =
        searchTerm === "" ||
        enrollment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.userId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUserId =
        activeFilter !== "user" ||
        filterUserId === "" ||
        enrollment.userId.toLowerCase().includes(filterUserId.toLowerCase());

      const matchesCourseId =
        activeFilter !== "course" ||
        filterCourseId === "" ||
        enrollment.courseId
          .toLowerCase()
          .includes(filterCourseId.toLowerCase());

      return matchesSearch && matchesUserId && matchesCourseId;
    });
  }, [enrollments, searchTerm, activeFilter, filterUserId, filterCourseId]);

  const calculateSystemStats = () => {
    if (!enrollments || enrollments.length === 0) {
      return {
        totalEnrollments: 0,
        completedEnrollments: 0,
        inProgressEnrollments: 0,
        completionRate: 0,
        activeUsers: 0,
        activeCourses: 0,
      };
    }

    const completed = enrollments.filter(
      (e: any) => e.status === "COMPLETED"
    ).length;
    const uniqueUsers = new Set(enrollments.map((e: any) => e.userId)).size;
    const uniqueCourses = new Set(enrollments.map((e: any) => e.courseId)).size;

    return {
      totalEnrollments: enrollments.length,
      completedEnrollments: completed,
      inProgressEnrollments: enrollments.length - completed,
      completionRate:
        enrollments.length > 0
          ? Math.round((completed / enrollments.length) * 100)
          : 0,
      activeUsers: uniqueUsers,
      activeCourses: uniqueCourses,
    };
  };

  const stats = calculateSystemStats();

  const handleViewDetail = (enrollment: any) => {
    setSelectedEnrollment(enrollment);
    setShowDetailModal(true);
  };

  const handleEditEnrollment = (enrollment: any) => {
    setSelectedEnrollment(enrollment);
    setEditData({
      progressPercentage: enrollment.progressPercentage?.toString() || "",
      status: enrollment.status || "",
      totalWatchTimeMinutes: enrollment.totalWatchTimeMinutes?.toString() || "",
    });
    setShowEditModal(true);
  };

  const handleDeleteEnrollment = async (enrollment: any) => {
    if (window.confirm(`Xác nhận xóa enrollment ${enrollment.id}?`)) {
      console.log("Delete enrollment:", enrollment.id);
    }
  };

  return {
    // State
    filterUserId,
    setFilterUserId,
    filterCourseId,
    setFilterCourseId,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    showDetailModal,
    setShowDetailModal,
    showEditModal,
    setShowEditModal,
    selectedEnrollment,
    editData,
    setEditData,

    // Data
    enrollments,
    filteredEnrollments,
    stats,
    loading,
    error,

    // Handlers
    handleViewDetail,
    handleEditEnrollment,
    handleDeleteEnrollment,
    fetchEnrollments,
  };
};
