import ProtectedRoute from "../../routes/ProtectedRoute";
import HomePage from "./page/HomePage";
import MyLearningPage from "./page/MyLearningPage";
import OnlineDegreesPage from "./page/OnlineDegreesPage";
import CareersPage from "./page/CareersPage";
import MainLayout from "../../layouts/MainLayout";
import EnrollmentLearn from "../enrollment/student/EnrollmentLearn";
export const homeRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/my-learning",
    element: (
      <ProtectedRoute roles={["LEARNER", "INSTRUCTOR"]}>
        <MainLayout>
          {/* <MyLearningPage /> */}
          <EnrollmentLearn/>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/online-degrees",
    element: <OnlineDegreesPage />,
  },
  {
    path: "/careers",
    element: <CareersPage />,
  }
];
