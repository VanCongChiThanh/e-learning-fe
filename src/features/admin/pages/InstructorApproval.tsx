import AdminLayout from "../../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import {
  instructorManageApi,
  InstructorCandidateResponse,
  PageInfo,
} from "../api/instructor-manage.api";

export default function InstructorApprovalPage() {
  const [applications, setApplications] = useState<
    InstructorCandidateResponse[]
  >([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Lưu trạng thái review inline
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

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">
          Danh sách ứng viên giảng viên
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : applications.length === 0 ? (
          <p>Không có ứng viên nào.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-blue-700">
                    Ứng viên
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-blue-700">
                    CV
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-blue-700">
                    Portfolio
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-blue-700">
                    Lý do ứng tuyển
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-blue-700">
                    Review
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {applications.map((app) => {
                  const review = reviewState[app.user_info?.user_id || ""] || {
                    action: "none",
                  };
                  return (
                    <tr
                      key={app.user_info?.user_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 flex items-center gap-3">
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
                      </td>

                      <td className="px-4 py-3">
                        <a
                          href={app.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Xem CV
                        </a>
                      </td>

                      <td className="px-4 py-3">
                        <a
                          href={app.portfolio_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Portfolio
                        </a>
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {app.motivation}
                      </td>

                      {/* Review actions */}
                      <td className="px-4 py-3 text-center">
                        {review.action === "none" && (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() =>
                                handleAccept(app.user_info?.user_id || "")
                              }
                              className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200"
                            >
                              Chấp nhận
                            </button>
                            <button
                              onClick={() =>
                                handleReject(app.user_info?.user_id || "")
                              }
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
                                handleReasonChange(
                                  app.user_info?.user_id || "",
                                  e.target.value
                                )
                              }
                              placeholder="Nhập lý do từ chối"
                              className="w-40 px-2 py-1 border rounded text-sm"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleSubmitReject(
                                    app.user_info?.user_id || ""
                                  )
                                }
                                className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                              >
                                Xác nhận từ chối
                              </button>
                              <button
                                onClick={() =>
                                  setReviewState((prev) => ({
                                    ...prev,
                                    [app.user_info?.user_id || ""]: {
                                      action: "none",
                                    },
                                  }))
                                }
                                className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                              >
                                Huỷ
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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
