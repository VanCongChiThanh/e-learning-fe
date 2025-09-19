import ProtectedRoute from "../../routes/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";
import MyCoursesPage from "./Mycourse";
import EditCourse from "./Instructor/EditCourse";
import MyCoursesInstructor from "./Instructor/MycourseInstructor";
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
];

