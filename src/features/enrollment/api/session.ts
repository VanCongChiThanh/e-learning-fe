import { AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";

// GET /api/v1/courses/{courseId}/sections -> getAllSections
export const getAllSections = async (courseId: UUID): Promise<any> => {
const res: AxiosResponse = await axiosAuth.get(`/courses/${courseId}/sections`);
return res.data;
};

// POST /api/v1/courses/{courseId}/sections -> createSection
export const createSection = async (
courseId: UUID,
data: {
title: string;
description?: string;
order?: number;
}
): Promise<any> => {
const res: AxiosResponse = await axiosAuth.post(`/courses/${courseId}/sections`, data);
return res.data;
};

// GET /api/v1/courses/{courseId}/sections/{sectionId} -> getSectionById
export const getSectionById = async (courseId: UUID, sectionId: UUID): Promise<any> => {
const res: AxiosResponse = await axiosAuth.get(`/courses/${courseId}/sections/${sectionId}`);
return res.data;
};

// PUT /api/v1/courses/{courseId}/sections/{sectionId} -> updateSection
export const updateSection = async (
courseId: UUID,
sectionId: UUID,
data: {
title?: string;
description?: string;
order?: number;
}
): Promise<any> => {
const res: AxiosResponse = await axiosAuth.put(`/courses/${courseId}/sections/${sectionId}`, data);
return res.data;
};

// DELETE /api/v1/courses/{courseId}/sections/{sectionId} -> deleteSection
export const deleteSection = async (courseId: UUID, sectionId: UUID): Promise<any> => {
const res: AxiosResponse = await axiosAuth.delete(`/courses/${courseId}/sections/${sectionId}`);
return res.data;
};
