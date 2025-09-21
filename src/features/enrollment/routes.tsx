import ProtectedRoute from "../../routes/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";
import EnrollmentLearn from "./student/EnrollmentLearn";

export const LearnRoutes = [
{
    path: "/learn/enrollments",
    element: (
    // <ProtectedRoute roles={["LEARN"]}>
        <MainLayout>
        <EnrollmentLearn userId="123e4567-e89b-12d3-a456-426614174000" />
        </MainLayout>
    // </ProtectedRoute>
    ),
},
];