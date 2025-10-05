import axios, { AxiosInstance, AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosAuth from "../../../api/axiosAuth";


// POST /api/quiz-attempts -> create
export const createQuizAttempt = async (data: {
  quizId: UUID;
  userId: UUID;
  enrollmentId?: UUID;
  questionId?: UUID;
  selectedOption?: string;
  attemptNumber?: number;
  timeTakenMinutes?: number;
}): Promise<any> => {
  console.log(data);
  const res: AxiosResponse = await axiosAuth.post("/quiz-attempts", data);
  return res.data;
};

// GET /api/quiz-attempts/quiz/{quizId} -> getByQuiz
export const getQuizAttemptsByQuiz = async (quizId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/quiz-attempts/quiz/${quizId}`);
  return res.data;
};

// GET /api/quiz-attempts/user/{userId} -> getByUser
export const getQuizAttemptsByUser = async (userId: UUID): Promise<any> => {
  const res: AxiosResponse = await axiosAuth.get(`/quiz-attempts/user/${userId}`);
  return res.data;
};

