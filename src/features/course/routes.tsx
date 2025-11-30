import ProtectedRoute from "../../routes/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";
import MyCoursesPage from "./Mycourse";
import EditCourse from "./Instructor/EditCourse";
import MyCoursesInstructor from "./Instructor/MycourseInstructor";
import LearningPage from "./Learning/LearningPage";
import EditLecture from "./Instructor/EditLecture";
import EditCourseDetail from "./Instructor/EditCoureseDetail";
import CreateCourse from "./Instructor/CreateCourse";
import CodePage from "./Learning/CodePage";
import EnrollmentProtectedRoute from "../../routes/EnrollmentProtechtedRoute";
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
      <EnrollmentProtectedRoute>
        <LearningPage />
      </EnrollmentProtectedRoute>
    ),
  },
  // {
  //   path: "/code-exercise/:exerciseId",
  //   element: (
  //     <ProtectedRoute roles={["LEARNER"]}>
  //       <CodePage />
  //     </ProtectedRoute>
  //   ),
  // },
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
    path: "/instructor/courses/create",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <CreateCourse />
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
  {
    path: "/instructor/courses/:courseId/detail",
    element: (
      <ProtectedRoute roles={["INSTRUCTOR"]}>
        <MainLayout>
          <EditCourseDetail />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {

  }
];

