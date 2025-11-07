import ProtectedRoute from "../../routes/ProtectedRoute";
import MainPage from "./page/MainPage";
import OnlineDegreesPage from "./page/OnlineDegreesPage";
import CareersPage from "./page/CareersPage";
import MainLayout from "../../layouts/MainLayout";
import EnrollmentLearn from "../enrollment/student/EnrollmentLearn";
import InstructorRegistration from "./page/InstructorRegistration/InstructorRegistration";
import CourseSearchPage from "./page/CourseSearchPage";
import CoursePreviewPage from "./page/CoursePreviewPage/CoursePreviewPage";
import CartPage from "./page/CartPage/CartPage";
import PaymentResult from "./page/CartPage/PaymentResult";
import CertificateDetailPage from "./page/CertificateDetailPage";

export const homeRoutes = [
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/courses/search",
    element: <CourseSearchPage />,
  },
  {
    path: "/courses/:slug",
    element: <CoursePreviewPage />,
  },
  {
    path: "/my-learning",
    element: (
      <ProtectedRoute roles={["LEARNER", "INSTRUCTOR"]}>
        <MainLayout>
          {/* <MyLearningPage /> */}
          <EnrollmentLearn />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/online-degrees",
    element: <OnlineDegreesPage />,
  },
  {
    path: "/certificate/:id",
    element: < CertificateDetailPage/>
  },
  {
    path: "/careers",
    element: <CareersPage />,
  },
  {
    path: "/instructor-registration",
    element: (
      <ProtectedRoute roles={["LEARNER"]}>
        <InstructorRegistration />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/payment-result",
    element:  < PaymentResult />
    }

];
