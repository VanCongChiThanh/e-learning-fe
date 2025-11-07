import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeLayout from "../layout/HomeLayout";
import MainLayout from "../../../layouts/MainLayout";
import { Award, Download, ArrowLeft, Share2, Calendar, User } from "lucide-react";
import {getCertificateDetailById} from "../api";
interface CertificateDetail {
  id: string;
  courseName: string;
  courseCode: string;
  certificateNumber: string;
  certificateUrl: string;
  issueDate?: string;
  instructor?: string;
  completionDate?: string;
  studentName?: string;
}

const CertificateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<CertificateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const fetchCertificate = async () => {
    const res = await getCertificateDetailById(id as string);
    setCertificate(res);
    setLoading(false);
    console.log(res);
  };

  fetchCertificate();
}, [id]);
 
  const handleShare = async () => {
    if (navigator.share && certificate) {
      try {
        await navigator.share({
          title: certificate.courseName,
          text: `Tôi vừa hoàn thành khóa học: ${certificate.courseName}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <HomeLayout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54]"></div>
          </div>
        </HomeLayout>
      </MainLayout>
    );
  }

  if (!certificate) {
    return (
      <MainLayout>
        <HomeLayout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <Award className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy chứng chỉ
              </h3>
              <button
                onClick={() => navigate("/certificates")}
                className="mt-4 text-[#106c54] hover:underline"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </HomeLayout>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <HomeLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại
              </button>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-6 h-6 text-[#106c54]" />
                    <span className="text-sm font-medium text-[#106c54] bg-green-50 px-3 py-1 rounded-full">
                      Đã hoàn thành
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {certificate.courseName}
                  </h1>
                  <p className="text-gray-600">
                    Mã chứng chỉ: <span className="font-mono font-semibold">{certificate.certificateNumber}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Certificate Image */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="relative">
                    {certificate?.certificateUrl?.trim().toLowerCase().endsWith('.pdf') && (
                          <iframe
                            src={certificate.certificateUrl}
                            className="w-full h-[500px] rounded-lg"
                            title={certificate.courseName}
                            allow="fullscreen"
                          />
                      )}
                    
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="p-6 border-t bg-gray-50">
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="flex-1 min-w-[200px] bg-[#106c54] text-white px-6 py-3 rounded-lg hover:bg-[#0d5443] transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                      >
                        <Download className="w-5 h-5" />
                        Tải xuống chứng chỉ
                      </button>
                      <button
                        onClick={handleShare}
                        className="flex-1 min-w-[200px] bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                      >
                        <Share2 className="w-5 h-5" />
                        Chia sẻ
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Info Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Thông tin chứng chỉ
                  </h2>
                  
                  <div className="space-y-4">
                    {certificate.studentName && (
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Học viên</p>
                          <p className="text-base font-semibold text-gray-900">
                            {certificate.studentName}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Mã khóa học</p>
                        <p className="text-base font-mono font-semibold text-gray-900">
                          {certificate.courseCode}
                        </p>
                      </div>
                    </div>

                    {certificate.issueDate && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Ngày cấp</p>
                          <p className="text-base font-semibold text-gray-900">
                            {certificate.issueDate}
                          </p>
                        </div>
                      </div>
                    )}

                    {certificate.instructor && (
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Giảng viên</p>
                          <p className="text-base font-semibold text-gray-900">
                            {certificate.instructor}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-[#106c54] mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#106c54] mb-1">
                            Chứng chỉ hợp lệ
                          </p>
                          <p className="text-xs text-gray-600">
                            Chứng chỉ này được cấp bởi hệ thống và có thể xác thực.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HomeLayout>
    </MainLayout>
  );
};

export default CertificateDetailPage;