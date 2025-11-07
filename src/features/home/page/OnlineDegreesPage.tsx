import HomeLayout from "../layout/HomeLayout";
import MainLayout from "../../../layouts/MainLayout";
import { getCetificateByUserId } from "../api";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Calendar, FileText, ChevronRight } from "lucide-react";

interface Certificate {
  id: string;
  courseName: string;
  courseCode: string;
  certificateNumber: string;
  certificateUrl?: string;
  issueDate?: string;
  instructor?: string;
}

const OnlineDegreesPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(
    (state: RootState) => state.auth as { user: { id: string } | null }
  );
  const userId = user?.id;
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getCetificateByUserId(userId)
        .then((data) => {
          setCertificates(data);
        })
        .catch((error) => {
          console.error("Error fetching certificates:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  return (
    <MainLayout>
      <HomeLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header Section */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-8 h-8 text-[#106c54]" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Chứng nhận của tôi
                </h1>
              </div>
              <p className="text-gray-600 mt-2">
                Quản lý và xem tất cả chứng chỉ bạn đã đạt được
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm border animate-pulse"
                  >
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-16">
                <Award className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Chưa có chứng chỉ
                </h3>
                <p className="text-gray-600">
                  Hoàn thành các khóa học để nhận chứng chỉ
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Tổng số:{" "}
                    <span className="font-semibold text-gray-900">
                      {certificates.length} chứng chỉ
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((certificate) => (
                    <div
                      key={certificate.id}
                      className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
                    >
                      {/* Certificate Preview */}
                      <div className="relative h-48 bg-gradient-to-br from-[#106c54] to-[#0d5443] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <Award className="w-20 h-20 text-white opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white px-4">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-90" />
                            <p className="text-sm font-medium opacity-90">
                              Chứng chỉ hoàn thành
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Certificate Info */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#106c54] transition-colors">
                          {certificate.courseName}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="font-mono">
                              {certificate.courseCode}
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Award className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="font-mono">
                              {certificate.certificateNumber}
                            </span>
                          </div>

                          {certificate.issueDate && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{certificate.issueDate}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            navigate(`/certificate/${certificate.id}`)
                          }
                          className="w-full bg-[#106c54] text-white px-4 py-2.5 rounded-lg hover:bg-[#0d5443] transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                        >
                          Xem chi tiết
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </HomeLayout>
    </MainLayout>
  );
};

export default OnlineDegreesPage;
