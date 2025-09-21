import ProtectedRoute from "../../routes/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";
import MyCoursesPage from "./Mycourse";
import EditCourse from "./Instructor/EditCourse";
import MyCoursesInstructor from "./Instructor/MycourseInstructor";
import LearningPage from "./Learning/LearningPage";
import EditLecture from "./Instructor/EditLecture";
export const courseRoutes = [
  {
    path: "/my-courses",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
        <MainLayout>
          <MyCoursesPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/learning/:slug",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
          <LearningPage />
      </ProtectedRoute>
    ),
  },
];

export const courseRoutesForInstructor = [
  {
    path: "instructor/my-courses",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <MyCoursesInstructor />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/instructor/courses/:courseId/edit",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <EditCourse />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/instructor/lectures/:lectureId/edit",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <EditLecture />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
];

