import axiosAuth from "../../../api/axiosAuth";
import { UUID } from "../utils/UUID"

// Get courses by instructor
export const getCoursesByInstructor = async (instructorId: UUID) => {
    const response = await axiosAuth.get(`/courses/instructor/${instructorId}`);
    return response.data;
}

// Get course details by ID
export const getCourseById = async (courseId: UUID) => {
    const response = await axiosAuth.get(`/courses/${courseId}`);
    return response.data;
}

// Get course statistics
export const getCourseStatistics = async (courseId: UUID) => {
    const response = await axiosAuth.get(`/courses/${courseId}/statistics`);
    return response.data;
}

// Update course information
export const updateCourse = async (courseId: UUID, data: any) => {
    const response = await axiosAuth.put(`/courses/${courseId}`, data);
    return response.data;
}