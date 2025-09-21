import ProtectedRoute from "../../routes/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";
import EnrollmentLearn from "./student/EnrollmentLearn";
import EnrollmentTeacher from "./teacher/EnrollmentTeacher";
import AdminLayout from "../../layouts/AdminLayout";
import EnrollmentManager from "./admin/EnrollmentManager";

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
    {
    path: "/teacher/enrollments",
    element: (
    // <ProtectedRoute roles={["LEARN"]}>
        <MainLayout>
        <EnrollmentTeacher courseId="a1c2d3e4-f567-8901-2345-6789abcdef13" />
        </MainLayout>
    // </ProtectedRoute>
    ),
    },
    {
    path: "/admin/enrollments",
    element: (
    // <ProtectedRoute roles={["LEARN"]}>
        <AdminLayout>
        <EnrollmentManager/>
        </AdminLayout>
    // </ProtectedRoute>
    ),
},
];