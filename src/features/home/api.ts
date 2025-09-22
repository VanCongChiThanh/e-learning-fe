import axiosAuth from "../../api/axiosAuth";

const getCourses = async () => {
  const response = await axiosAuth.get("/courses");
  return response.data;
};

export { getCourses };
