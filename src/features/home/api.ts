import axiosAuth from "../../api/axiosAuth";

export interface ApplyInstructorRequest {
  cv_url: string; // cv_url trong JSON
  portfolioLink: string; // portfolio_link trong JSON
  motivation: string;
  extra_info?: Record<string, any>;
}

export const getCourses = async () => {
  const response = await axiosAuth.get("/courses");
  return response.data;
};
export const applyInstructor = async (data: ApplyInstructorRequest) => {
  const response = await axiosAuth.post(
    "/instructor/applications/apply",
    data
  );
  return response.data;
};

