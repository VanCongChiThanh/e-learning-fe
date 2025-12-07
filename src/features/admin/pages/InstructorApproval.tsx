import AdminLayout from "../../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import {
  instructorManageApi,
  InstructorCandidateResponse,
  PageInfo,
} from "../api/instructorManageAPI";
import { toast } from "react-toastify";
import { AdminTable, Column } from "../components/AdminTable/AdminTable"; // Adjust path

type TabType = "pending" | "history";

export default function InstructorApprovalPage() {
  const [applications, setApplications] = useState<
    InstructorCandidateResponse[]
  >([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  // Modal states
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] =
    useState<string>("");
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await instructorManageApi.getAllApplications(
          currentPage,
          pageSize,
          "created_at",
          "desc",
          activeTab === "pending" ? "PENDING" : undefined,
          activeTab === "history" ? "PENDING" : undefined
        );
        setApplications(res.data);
        if (res.meta) setPageInfo(res.meta);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentPage, pageSize, activeTab]);

  const handleOpenAcceptModal = (applicationId: string) => {
    console.log("Opening accept modal with applicationId:", applicationId);
    setSelectedApplicationId(applicationId);
    setShowAcceptModal(true);
  };

  const handleOpenRejectModal = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleConfirmAccept = async () => {
    setSubmitting(true);
    try {
      await instructorManageApi.reviewApplication(selectedApplicationId, {
        status: "APPROVED",
      });
      setApplications((prev) =>
        prev.filter((app) => app.id !== selectedApplicationId)
      );
      setShowAcceptModal(false);
      toast.success("Đã chấp nhận đơn ứng tuyển thành công!");
    } catch (error) {
      console.error("Failed to accept application", error);
      toast.error("Có lỗi xảy ra khi chấp nhận đơn ứng tuyển");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.warning("Vui lòng nhập lý do từ chối");
      return;
    }

    setSubmitting(true);
    try {
      await instructorManageApi.reviewApplication(selectedApplicationId, {
        status: "REJECTED",
        reason: rejectReason,
      });
      setApplications((prev) =>
        prev.filter((app) => app.id !== selectedApplicationId)
      );
      setShowRejectModal(false);
      setRejectReason("");
      toast.success("Đã từ chối đơn ứng tuyển");
    } catch (error) {
      console.error("Failed to reject application", error);
      toast.error("Có lỗi xảy ra khi từ chối đơn ứng tuyển");
    } finally {
      setSubmitting(false);
    }
  };

  // Define columns INSIDE component để có thể access các functions
  const columns: Column<InstructorCandidateResponse>[] = [
    {
      key: "candidate",
      header: "Ứng viên",
      width: 300,
      minWidth: 150,
      render: (app) => (
        <div className="flex items-center gap-3">
          <img
            src={
              app.user_info?.avatar ||
              `https://ui-avatars.com/api/?name=${app.user_info?.name}`
            }
            alt="avatar"
            className="h-10 w-10 rounded-full border border-gray-200 object-cover"
          />
          <span className="font-medium text-gray-800">
            {app.user_info?.name}
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Thời gian nộp",
      width: 150,
      minWidth: 130,
      render: (app) => (
        <div className="text-sm text-gray-700">
          {new Date(app.created_at).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      key: "cv",
      header: "CV",
      width: 100,
      minWidth: 80,
      render: (app) => (
        <a
          href={app.cv_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Xem CV
        </a>
      ),
    },
    {
      key: "portfolio",
      header: "Portfolio",
      width: 120,
      minWidth: 100,
      render: (app) => (
        <a
          href={app.portfolio_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Portfolio
        </a>
      ),
    },
    {
      key: "motivation",
      header: "Lý do ứng tuyển",
      width: 180,
      minWidth: 200,
      maxWidth: 500,
      render: (app) => <div className="text-gray-700">{app.motivation}</div>,
    },
    {
      key: "review",
      header: "Review",
      width: 200,
      minWidth: 200,
      render: (app) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleOpenAcceptModal(app.id || "")}
                className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200"
              >
                Chấp nhận
              </button>
              <button
                onClick={() => handleOpenRejectModal(app.id || "")}
                className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
              >
                Từ chối
              </button>
            </div>
          </div>
        );
      },
    },
  ];

  const historyColumns: Column<InstructorCandidateResponse>[] = [
    {
      key: "candidate",
      header: "Ứng viên",
      width: 250,
      minWidth: 150,
      render: (app) => (
        <div className="flex items-center gap-3">
          <img
            src={
              app.user_info?.avatar ||
              `https://ui-avatars.com/api/?name=${app.user_info?.name}`
            }
            alt="avatar"
            className="h-10 w-10 rounded-full border border-gray-200 object-cover"
          />
          <span className="font-medium text-gray-800">
            {app.user_info?.name}
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Thời gian nộp",
      width: 150,
      minWidth: 130,
      render: (app) => (
        <div className="text-sm">
          <div className="text-gray-700">
            {new Date(app.created_at).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
          <div className="text-gray-500 text-xs">
            {new Date(app.created_at).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      key: "updated_at",
      header: "Thời gian xử lý",
      width: 150,
      minWidth: 130,
      render: (app) => (
        <div className="text-sm">
          <div className="text-gray-700">
            {new Date(app.updated_at).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
          <div className="text-gray-500 text-xs">
            {new Date(app.updated_at).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      key: "cv",
      header: "CV",
      width: 100,
      minWidth: 80,
      render: (app) => (
        <a
          href={app.cv_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Xem CV
        </a>
      ),
    },
    {
      key: "portfolio",
      header: "Portfolio",
      width: 120,
      minWidth: 100,
      render: (app) => (
        <a
          href={app.portfolio_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Portfolio
        </a>
      ),
    },
    {
      key: "motivation",
      header: "Lý do ứng tuyển",
      width: 180,
      minWidth: 200,
      maxWidth: 400,
      render: (app) => <div className="text-gray-700">{app.motivation}</div>,
    },
    {
      key: "status",
      header: "Trạng thái",
      width: 150,
      minWidth: 150,
      render: (app) => {
        const statusConfig = {
          APPROVED: {
            label: "Đã chấp nhận",
            className: "bg-green-100 text-green-700 border-green-200",
            icon: "fa-check",
          },
          REJECTED: {
            label: "Đã từ chối",
            className: "bg-red-100 text-red-700 border-red-200",
            icon: "fa-xmark",
          },
          CANCELED: {
            label: "Đã hủy",
            className: "bg-gray-100 text-gray-700 border-gray-200",
            icon: "fa-ban",
          },
        };

        const config = statusConfig[app.status as keyof typeof statusConfig];

        return (
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
              config?.className || ""
            }`}
          >
            <i className={`fa-solid ${config?.icon}`}></i>
            {config?.label || app.status}
          </span>
        );
      },
    },
  ];

  const getSelectedUser = () => {
    return applications.find((app) => app.id === selectedApplicationId);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 bg-gray-50/50 border-b border-gray-200">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên ứng viên..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Sắp xếp:
                </span>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  aria-label="Sắp xếp"
                >
                  <option value="created_at_desc">Mới nhất</option>
                  <option value="created_at_asc">Cũ nhất</option>
                  <option value="name_asc">Tên A-Z</option>
                  <option value="name_desc">Tên Z-A</option>
                </select>
              </div>

              {/* Refresh */}
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white border border-gray-300 rounded-lg transition-colors"
                title="Làm mới"
              >
                <i className="fa-solid fa-refresh"></i>
              </button>

              {/* Toggle History/Pending Button */}
              {activeTab === "pending" ? (
                <button
                  onClick={() => {
                    setActiveTab("history");
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  <i className="fa-solid fa-history"></i>
                  <span>Lịch sử</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab("pending");
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
                >
                  <i className="fa-solid fa-arrow-left mr-1"></i>
                  <span>Quay lại chờ duyệt</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-4 py-3 bg-white flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                <i className="fa-solid fa-users mr-2 text-blue-600"></i>
                Tổng:{" "}
                <span className="font-semibold text-gray-900">
                  {pageInfo?.total_count || 0}
                </span>{" "}
                ứng viên
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <i className="fa-solid fa-info-circle"></i>
              <span>
                {activeTab === "pending"
                  ? "Danh sách ứng viên đang chờ phê duyệt"
                  : "Lịch sử các đơn đã được xử lý"}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <AdminTable
          columns={activeTab === "pending" ? columns : historyColumns}
          data={applications}
          loading={loading}
          emptyMessage={
            activeTab === "pending"
              ? "Không có ứng viên chờ duyệt."
              : "Chưa có lịch sử phê duyệt."
          }
          rowKey={(item) => item.id || ""}
        />

        {/* Accept Confirmation Modal */}
        {showAcceptModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
            onClick={() => !submitting && setShowAcceptModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <i className="fa-solid fa-check text-green-600 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Xác nhận chấp nhận
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Bạn có chắc chắn muốn chấp nhận đơn ứng tuyển của{" "}
                    <span className="font-semibold text-gray-900">
                      {getSelectedUser()?.user_info?.name}
                    </span>
                    ?
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowAcceptModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                      disabled={submitting}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleConfirmAccept}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                      disabled={submitting}
                    >
                      {submitting && (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      )}
                      {submitting ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
            onClick={() => !submitting && setShowRejectModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <i className="fa-solid fa-xmark text-red-600 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Từ chối đơn ứng tuyển
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Bạn đang từ chối đơn ứng tuyển của{" "}
                    <span className="font-semibold text-gray-900">
                      {getSelectedUser()?.user_info?.name}
                    </span>
                  </p>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lý do từ chối <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Nhập lý do từ chối..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows={4}
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowRejectModal(false);
                        setRejectReason("");
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                      disabled={submitting}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleConfirmReject}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                      disabled={submitting}
                    >
                      {submitting && (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      )}
                      {submitting ? "Đang xử lý..." : "Xác nhận từ chối"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pageInfo && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Trang {pageInfo.current_page} / {pageInfo.total_pages} — Tổng:{" "}
              {pageInfo.total_count} ứng viên
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fa-solid fa-chevron-left mr-2"></i>
                Trước
              </button>

              {pageInfo.total_pages > 1 && (
                <div className="flex gap-1">
                  {Array.from({ length: pageInfo.total_pages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page and adjacent pages
                      return (
                        page === 1 ||
                        page === pageInfo.total_pages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, arr) => {
                      // Add ellipsis if gap between pages
                      const prevPage = arr[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <>
                          {showEllipsis && (
                            <span
                              key={`ellipsis-${page}`}
                              className="px-3 py-2 text-gray-500"
                            >
                              ...
                            </span>
                          )}
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        </>
                      );
                    })}
                </div>
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(pageInfo.total_pages, prev + 1)
                  )
                }
                disabled={currentPage === pageInfo.total_pages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
                <i className="fa-solid fa-chevron-right ml-2"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
