import ProtectedRoute from "../../routes/ProtectedRoute";
import HomePage from "./page/HomePage";
import MyLearningPage from "./page/MyLearningPage";
import OnlineDegreesPage from "./page/OnlineDegreesPage";
import CareersPage from "./page/CareersPage";
export const homeRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/my-learning",
    element: (
      <ProtectedRoute roles={["ADMIN","LEARNER","INSTRUCTOR"]}>
        <MyLearningPage />
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
