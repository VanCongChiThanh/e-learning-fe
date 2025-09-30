import { AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";

// GET /api/v1/sections/{sectionId}/lectures -> getAllLectures
export const getAllLectures = async (sectionId: UUID): Promise<any> => {
    const res: AxiosResponse = await axiosAuth.get(`/sections/${sectionId}/lectures`);
    return res.data;
};

// POST /api/v1/sections/{sectionId}/lectures -> createLecture
export const createLecture = async (
    sectionId: UUID,
    data: {
        title: string;
        description?: string;
        order?: number;
        durationMinutes?: number;
    }
): Promise<any> => {
    const res: AxiosResponse = await axiosAuth.post(`/sections/${sectionId}/lectures`, data);
    return res.data;
};

// GET /api/v1/sections/{sectionId}/lectures/{lectureId} -> getLectureById
export const getLectureById = async (sectionId: UUID, lectureId: UUID): Promise<any> => {
    const res: AxiosResponse = await axiosAuth.get(`/sections/${sectionId}/lectures/${lectureId}`);
    return res.data;
};

// PUT /api/v1/sections/{sectionId}/lectures/{lectureId} -> updateLecture
export const updateLecture = async (
    sectionId: UUID,
    lectureId: UUID,
    data: {
        title?: string;
        description?: string;
        order?: number;
        durationMinutes?: number;
    }
): Promise<any> => {
    const res: AxiosResponse = await axiosAuth.put(`/sections/${sectionId}/lectures/${lectureId}`, data);
    return res.data;
};

// DELETE /api/v1/sections/{sectionId}/lectures/{lectureId} -> deleteLecture
export const deleteLecture = async (sectionId: UUID, lectureId: UUID): Promise<any> => {
    const res: AxiosResponse = await axiosAuth.delete(`/sections/${sectionId}/lectures/${lectureId}`);
    return res.data;
};

// PATCH /api/v1/sections/{sectionId}/lectures/{lectureId}/video -> updateLectureVideo
export const updateLectureVideo = async (
    sectionId: UUID,
    lectureId: UUID,
    file: File
): Promise<any> => {
    const formData = new FormData();
    formData.append("video", file);

    const res: AxiosResponse = await axiosAuth.patch(
        `/sections/${sectionId}/lectures/${lectureId}/video`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return res.data;
};
