import HomeLayout from "../layout/HomeLayout";
import MainLayout from "../../../layouts/MainLayout";
import { getCetificateByUserId } from "../api";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Calendar,
  FileText,
  ChevronRight,
  GraduationCap,
  Search,
} from "lucide-react";

interface Certificate {
  id: string;
  courseName: string;
  courseCode: string;
  certificateNumber: string;
  certificateUrl?: string;
  issueDate?: string;
  instructor?: string;
}

interface VerificationResult {
  id: string;
  enrollmentId: string;
  userId: string;
  courseId: string;
  certificateNumber: string;
  issuedDate: number;
  expiryDate: number | null;
  templateUrl: string | null;
  certificateUrl: string;
  isVerified: boolean;
  createdAt: number;
  courseName: string;
  courseCode: string;
  userName: string | null;
  imageUrl: string;
  userEmail: string | null;
  completionScore: number;
  courseCompletionDate: number;
}

const OnlineDegreesPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(
    (state: RootState) => state.auth as { user: { id: string } | null }
  );
  const userId = user?.id;
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [activeTab, setActiveTab] = useState<"verification" | "certificates">(
    "verification"
  );

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

  const handleVerifyCertificate = async () => {
    if (!verificationCode.trim()) {
      setVerificationError("Vui lòng nhập mã chứng nhận");
      return;
    }

    setVerificationLoading(true);
    setVerificationError("");
    setVerificationResult(null);

    try {
      const response = await fetch(
        `http://localhost:8105/api/v1/certificates/verify-certificate?code=${verificationCode.trim()}`
      );

      if (response.ok) {
        const data = await response.json();
        setVerificationResult(data);
      } else {
        setVerificationError("Không tìm thấy chứng nhận hoặc mã không hợp lệ");
      }
    } catch (error) {
      console.error("Error verifying certificate:", error);
      setVerificationError("Đã có lỗi xảy ra khi xác thực chứng nhận");
    } finally {
      setVerificationLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("vi-VN");
  };

  return (
    <MainLayout>
      <HomeLayout>
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
          {/* CSS Animations */}
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes float-delayed {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-15px); }
            }
            @keyframes bounce-gentle {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-5px); }
            }
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
            .animate-float-delayed {
              animation: float-delayed 4s ease-in-out infinite;
              animation-delay: 1s;
            }
            .animate-bounce-gentle {
              animation: bounce-gentle 2s ease-in-out infinite;
            }
            .animate-spin-slow {
              animation: spin-slow 20s linear infinite;
            }
          `}</style>

          {/* Background decorative elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-10 opacity-5">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className="animate-spin-slow"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="#106c54"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  stroke="#106c54"
                  strokeWidth="1"
                  fill="none"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="40"
                  stroke="#106c54"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>
            <div className="absolute bottom-1/4 right-10 opacity-5 animate-float">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <polygon
                  points="75,10 95,50 135,50 105,75 115,115 75,95 35,115 45,75 15,50 55,50"
                  fill="#106c54"
                />
              </svg>
            </div>
          </div>
          {/* Header Section */}
          <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-[#106c54]" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Chứng nhận học tập
                </h1>
              </div>
              <p className="text-gray-600">
                Xác thực và quản lý chứng nhận khóa học trực tuyến
              </p>

              {/* Navigation Tabs */}
              <div className="mt-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("verification")}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "verification"
                        ? "border-[#106c54] text-[#106c54]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Xác thực chứng nhận
                  </button>
                  <button
                    onClick={() => setActiveTab("certificates")}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "certificates"
                        ? "border-[#106c54] text-[#106c54]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Chứng nhận của tôi
                    {certificates.length > 0 && (
                      <span className="ml-2 bg-[#106c54] text-white text-xs rounded-full px-2 py-0.5">
                        {certificates.length}
                      </span>
                    )}
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "verification" ? (
            /* Certificate Verification Section */
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 opacity-10">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    className="animate-pulse"
                  >
                    <circle cx="60" cy="60" r="40" fill="#106c54" />
                    <circle cx="60" cy="60" r="20" fill="#ffffff" />
                  </svg>
                </div>
                <div className="absolute top-20 right-20 opacity-10 animate-bounce">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <polygon
                      points="40,10 60,35 85,35 65,55 75,80 40,65 5,80 15,55 -5,35 20,35"
                      fill="#106c54"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-20 left-20 opacity-10 animate-pulse">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <rect
                      x="20"
                      y="20"
                      width="60"
                      height="60"
                      rx="10"
                      fill="#106c54"
                    />
                    <rect
                      x="30"
                      y="30"
                      width="40"
                      height="40"
                      rx="5"
                      fill="#ffffff"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-10 right-10 opacity-10">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    className="animate-spin-slow"
                  >
                    <path
                      d="M30,5 L35,25 L55,25 L40,35 L45,55 L30,45 L15,55 L20,35 L5,25 L25,25 Z"
                      fill="#106c54"
                    />
                  </svg>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#106c54] via-[#0d8a63] to-[#0a6b4f] rounded-2xl p-8 text-center shadow-xl relative overflow-hidden">
                {/* Inner decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-4 left-4 opacity-20">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      className="animate-float"
                    >
                      <circle
                        cx="20"
                        cy="20"
                        r="15"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle cx="20" cy="20" r="5" fill="white" />
                    </svg>
                  </div>
                  <div className="absolute top-6 right-8 opacity-20 animate-float-delayed">
                    <svg width="30" height="30" viewBox="0 0 30 30">
                      <polygon
                        points="15,2 18,12 28,12 20,18 23,28 15,22 7,28 10,18 2,12 12,12"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-6 left-8 opacity-20 animate-float">
                    <svg width="35" height="35" viewBox="0 0 35 35">
                      <rect
                        x="5"
                        y="5"
                        width="25"
                        height="25"
                        rx="5"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                      <rect
                        x="12"
                        y="12"
                        width="11"
                        height="11"
                        rx="2"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-20 animate-float-delayed">
                    <svg width="25" height="25" viewBox="0 0 25 25">
                      <circle
                        cx="12.5"
                        cy="12.5"
                        r="10"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mb-8 relative z-10">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 rounded-full p-4 relative animate-bounce-gentle">
                      <GraduationCap className="w-12 h-12 text-white" />
                      {/* Decorative rings around graduation cap */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                      <div className="absolute -inset-2 rounded-full border border-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Xác thực chứng nhận
                  </h2>
                  <p className="text-white/90 text-lg max-w-2xl mx-auto">
                    Nhập mã chứng nhận để xác minh tính xác thực và hợp lệ của
                    giấy chứng nhận học tập
                  </p>
                </div>

                <div className="space-y-6 max-w-lg mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleVerifyCertificate()
                      }
                      placeholder="Nhập mã chứng nhận (VD: CERT-1761397412932-7971073A)"
                      className="w-full px-6 py-4 rounded-xl border-0 focus:ring-2 focus:ring-white/50 focus:outline-none text-gray-800 placeholder-gray-500 text-center text-lg shadow-lg"
                    />
                  </div>

                  <button
                    onClick={handleVerifyCertificate}
                    disabled={verificationLoading}
                    className="w-full bg-white text-[#106c54] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {verificationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#106c54] border-t-transparent"></div>
                        Đang xác thực...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Xác thực ngay!
                      </>
                    )}
                  </button>
                </div>

                {verificationError && (
                  <div className="mt-6 bg-red-500/20 border border-red-300/50 rounded-xl p-4 max-w-lg mx-auto">
                    <p className="text-white font-medium">
                      {verificationError}
                    </p>
                  </div>
                )}
              </div>

              {/* Verification Result */}
              {verificationResult && (
                <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#106c54]/10 relative">
                  {/* Success decoration */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      className="animate-spin-slow"
                    >
                      <circle
                        cx="30"
                        cy="30"
                        r="25"
                        stroke="#106c54"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M20 30 L27 37 L40 23"
                        stroke="#106c54"
                        strokeWidth="3"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className="bg-gradient-to-r from-[#106c54] to-[#0d8a63] p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 rounded-full p-3">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          Chứng nhận hợp lệ ✓
                        </h3>
                        <p className="text-white/90 text-lg">
                          Chứng nhận đã được xác thực thành công
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className="text-xl font-bold text-[#106c54] mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Thông tin khóa học
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <span className="font-semibold text-gray-700 block">
                                Tên khóa học:
                              </span>
                              <span className="text-gray-900 text-lg">
                                {verificationResult.courseName}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700 block">
                                Mã khóa học:
                              </span>
                              <span className="text-gray-900 font-mono text-lg">
                                {verificationResult.courseCode}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className="text-xl font-bold text-[#106c54] mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Thông tin chứng nhận
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <span className="font-semibold text-gray-700 block">
                                Mã chứng nhận:
                              </span>
                              <span className="text-gray-900 font-mono text-lg">
                                {verificationResult.certificateNumber}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700 block">
                                Ngày cấp:
                              </span>
                              <span className="text-gray-900 text-lg">
                                {formatDate(verificationResult.issuedDate)}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700 block">
                                Ngày hoàn thành:
                              </span>
                              <span className="text-gray-900 text-lg">
                                {formatDate(
                                  verificationResult.courseCompletionDate
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className="text-xl font-bold text-[#106c54] mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Kết quả học tập
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <span className="font-semibold text-gray-700 block">
                                Điểm hoàn thành:
                              </span>
                              <span className="text-gray-900 text-lg">
                                {verificationResult.completionScore.toFixed(2)}%
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700 block">
                                Trạng thái:
                              </span>
                              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-[#106c54] text-white">
                                ✓ Đã xác thực
                              </span>
                            </div>
                          </div>
                        </div>

                        {verificationResult.certificateUrl && (
                          <div className="bg-gray-50 rounded-xl p-6">
                            <h4 className="text-xl font-bold text-[#106c54] mb-4 flex items-center gap-2">
                              <FileText className="w-5 h-5" />
                              Tài liệu
                            </h4>
                            <a
                              href={verificationResult.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 bg-[#106c54] text-white hover:bg-[#0d5443] px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                            >
                              <FileText className="w-5 h-5" />
                              Tải chứng nhận PDF
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {verificationResult.imageUrl && (
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <h4 className="text-xl font-bold text-[#106c54] mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Hình ảnh khóa học
                        </h4>
                        <img
                          src={verificationResult.imageUrl}
                          alt="Course Image"
                          className="w-full max-w-2xl h-64 object-cover rounded-xl shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* My Certificates Section */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-sm border-2 border-gray-100 animate-pulse"
                    >
                      <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                      <div className="p-6">
                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-20 relative">
                  {/* Empty state decorations */}
                  <div className="absolute top-10 left-1/4 opacity-10">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      className="animate-float"
                    >
                      <circle
                        cx="20"
                        cy="20"
                        r="15"
                        stroke="#106c54"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className="absolute top-20 right-1/4 opacity-10 animate-float-delayed">
                    <svg width="30" height="30" viewBox="0 0 30 30">
                      <rect
                        x="5"
                        y="5"
                        width="20"
                        height="20"
                        rx="3"
                        stroke="#106c54"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center relative animate-pulse">
                    <Award className="w-16 h-16 text-gray-400" />
                    <div className="absolute inset-0 rounded-full border-2 border-gray-300/50 animate-ping"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Chưa có chứng nhận
                  </h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    Hoàn thành các khóa học để nhận chứng nhận và xây dựng hồ sơ
                    học tập của bạn
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Chứng nhận của tôi
                      </h2>
                      <p className="text-gray-600">
                        Tổng số:{" "}
                        <span className="font-bold text-[#106c54] text-lg">
                          {certificates.length} chứng nhận
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate) => (
                      <div
                        key={certificate.id}
                        className="bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:shadow-lg hover:border-[#106c54]/30 transition-all duration-300 overflow-hidden group"
                      >
                        {/* Certificate Preview */}
                        <div className="relative h-48 bg-gradient-to-br from-[#106c54] to-[#0d5443] flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                          <Award className="w-20 h-20 text-white opacity-20" />

                          {/* Decorative elements */}
                          <div className="absolute top-2 right-2 opacity-30">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              className="animate-pulse"
                            >
                              <circle
                                cx="10"
                                cy="10"
                                r="8"
                                stroke="white"
                                strokeWidth="1"
                                fill="none"
                              />
                            </svg>
                          </div>
                          <div className="absolute bottom-2 left-2 opacity-30 animate-float">
                            <svg width="15" height="15" viewBox="0 0 15 15">
                              <polygon
                                points="7.5,1 9,5 13,5 10,7.5 11.5,11.5 7.5,9 3.5,11.5 5,7.5 2,5 6,5"
                                fill="white"
                              />
                            </svg>
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white px-4">
                              <FileText className="w-12 h-12 mx-auto mb-2 opacity-90 animate-bounce-gentle" />
                              <p className="font-semibold opacity-90">
                                Chứng nhận hoàn thành
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Certificate Info */}
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#106c54] transition-colors">
                            {certificate.courseName}
                          </h3>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm text-gray-600">
                              <FileText className="w-4 h-4 mr-3 text-gray-400" />
                              <span className="font-mono">
                                {certificate.courseCode}
                              </span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                              <Award className="w-4 h-4 mr-3 text-gray-400" />
                              <span className="font-mono">
                                {certificate.certificateNumber}
                              </span>
                            </div>

                            {certificate.issueDate && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                                <span>{certificate.issueDate}</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              navigate(`/certificate/${certificate.id}`)
                            }
                            className="w-full bg-[#106c54] text-white px-4 py-3 rounded-xl hover:bg-[#0d5443] transition-colors duration-200 flex items-center justify-center gap-2 font-semibold"
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
          )}
        </div>
      </HomeLayout>
    </MainLayout>
  );
};

export default OnlineDegreesPage;
