import AdminLayout from "../../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import {
  instructorManageApi,
  InstructorCandidateResponse,
  PageInfo,
} from "../api/instructorManageAPI";
import { AdminTable, Column } from "../components/AdminTable/AdminTable"; // Adjust path

export default function InstructorApprovalPage() {
  const [applications, setApplications] = useState<InstructorCandidateResponse[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewState, setReviewState] = useState<{
    [id: string]: { action: "none" | "accept" | "reject"; reason?: string };
  }>({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await instructorManageApi.getAllApplications();
        setApplications(res.data);
        if (res.meta) setPageInfo(res.meta);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleAccept = (id: string) => {
    setReviewState((prev) => ({ ...prev, [id]: { action: "accept" } }));
    // TODO: gọi API duyệt
  };

  const handleReject = (id: string) => {
    setReviewState((prev) => ({ ...prev, [id]: { action: "reject" } }));
  };

  const handleReasonChange = (id: string, reason: string) => {
    setReviewState((prev) => ({ ...prev, [id]: { action: "reject", reason } }));
  };

  const handleSubmitReject = (id: string) => {
    const reason = reviewState[id]?.reason || "";
    // TODO: gọi API từ chối với reason
    console.log("Reject", id, reason);
  };

  // Define columns INSIDE component để có thể access các functions
  const columns: Column<InstructorCandidateResponse>[] = [
    {
      key: 'candidate',
      header: 'Ứng viên',
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
      )
    },
    {
      key: 'cv',
      header: 'CV',
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
      )
    },
    {
      key: 'portfolio',
      header: 'Portfolio',
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
      )
    },
    {
      key: 'motivation',
      header: 'Lý do ứng tuyển',
      width: 180,
      minWidth: 200,
      maxWidth: 500,
      render: (app) => (
        <div className="text-gray-700">{app.motivation}</div>
      )
    },
    {
      key: 'review',
      header: 'Review',
      width: 200,
      minWidth: 200,
      render: (app) => {
        const review = reviewState[app.user_info?.user_id || ""] || { action: "none" };
        
        return (
          <div onClick={(e) => e.stopPropagation()}>
            {review.action === "none" && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleAccept(app.user_info?.user_id || "")}
                  className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200"
                >
                  Chấp nhận
                </button>
                <button
                  onClick={() => handleReject(app.user_info?.user_id || "")}
                  className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Từ chối
                </button>
              </div>
            )}

            {review.action === "accept" && (
              <span className="text-green-600 font-medium">
                ✔ Đã chấp nhận
              </span>
            )}

            {review.action === "reject" && (
              <div className="flex flex-col gap-2 items-center">
                <input
                  type="text"
                  value={review.reason || ""}
                  onChange={(e) =>
                    handleReasonChange(app.user_info?.user_id || "", e.target.value)
                  }
                  placeholder="Nhập lý do từ chối"
                  className="w-full px-2 py-1 border rounded text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSubmitReject(app.user_info?.user_id || "")}
                    className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Xác nhận từ chối
                  </button>
                  <button
                    onClick={() =>
                      setReviewState((prev) => ({
                        ...prev,
                        [app.user_info?.user_id || ""]: { action: "none" },
                      }))
                    }
                    className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Huỷ
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">
          Danh sách ứng viên giảng viên
        </h1>

        <AdminTable
          columns={columns}
          data={applications}
          loading={loading}
          emptyMessage="Không có ứng viên nào."
          rowKey={(item) => item.user_info?.user_id || ""}
        />

        {pageInfo && (
          <div className="mt-4 text-sm text-gray-600">
            Trang {pageInfo.current_page} / {pageInfo.total_pages} — Tổng:{" "}
            {pageInfo.total_items}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}