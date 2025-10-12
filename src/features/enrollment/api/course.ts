import { AxiosResponse } from "axios";
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
export const getAllSections = async (courseId: UUID): Promise<any> => {
    const res: AxiosResponse = await axiosAuth.get(`/courses/${courseId}/sections`);
    return res.data;
};
export const getAllLectures = async (sectionId: UUID): Promise<any> => {
    const res: AxiosResponse = await axiosAuth.get(`/sections/${sectionId}/lectures`);
    return res.data;
};
export const api = {
    course: {
        getCoursesByInstructor,
        getCourseById, getAllSections, getAllLectures
    }
};
