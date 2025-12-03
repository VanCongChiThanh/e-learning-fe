import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getMyBankAccount,
  createBankAccount,
  updateBankAccount,
  confirmBankAccount,
  BankAccountResponse,
  BankAccountRequest,
  BankItem,
} from "../api";
import InstructorProfileLayout from "./ProfileLayout";
import BankSelector from "./BankSelector";

const BankAccountPage: React.FC = () => {
  const [bankData, setBankData] = useState<BankAccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // confirm dialog
  const [confirmToken, setConfirmToken] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [formData, setFormData] = useState<BankAccountRequest>({
    account_number: "",
    account_holder_name: "",
    bank_name: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchBankAccount();
  }, []);

  const fetchBankAccount = async () => {
    try {
      setLoading(true);
      const data = await getMyBankAccount();
      setBankData(data);
      setIsEditing(false);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setBankData(null);
        setIsEditing(true);
      } else {
        toast.error(
          err.response?.data?.error?.message ||
            "Không thể tải thông tin tài khoản ngân hàng"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // handle validation + form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.account_number.trim()) {
      newErrors.account_number = "Vui lòng nhập số tài khoản";
    }

    if (!formData.account_holder_name.trim()) {
      newErrors.account_holder_name = "Vui lòng nhập tên chủ tài khoản";
    }

    if (!formData.bank_name.trim()) {
      newErrors.bank_name = "Vui lòng nhập tên ngân hàng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit create / update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      if (bankData?.active_bank) {
        // update → create pending
        const updated = await updateBankAccount(formData);
        setBankData(updated);
        toast.success(
          "Gửi yêu cầu cập nhật thành công! Vui lòng kiểm tra email để xác nhận."
        );
      } else {
        // create new
        const created = await createBankAccount(formData);
        setBankData(created);
        toast.success(
          "Tạo tài khoản ngân hàng thành công! Vui lòng kiểm tra email để xác nhận."
        );
      }

      setIsEditing(false);
      setFormData({
        account_number: "",
        account_holder_name: "",
        bank_name: "",
      });
    } catch (err: any) {
      toast.error(
        err.response?.data?.error?.message ||
          "Không thể lưu thông tin tài khoản ngân hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  // confirm OTP token
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmToken.trim()) {
      toast.error("Vui lòng nhập mã xác nhận");
      return;
    }

    try {
      setLoading(true);
      await confirmBankAccount(confirmToken);
      toast.success("Xác nhận tài khoản ngân hàng thành công!");
      setShowConfirmDialog(false);
      setConfirmToken("");
      fetchBankAccount();
    } catch (err: any) {
      toast.error(
        err.response?.data?.error?.message || "Mã xác nhận không hợp lệ"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      account_number: "",
      account_holder_name: "",
      bank_name: "",
    });
    setIsEditing(false);
    setErrors({});
  };

  // UI render bank item (active or pending)
  const renderBankItem = (bank: BankItem, isPending: boolean = false) => (
    <div
      className={`p-4 rounded-lg border ${
        isPending
          ? "bg-yellow-50 border-yellow-200"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <i className="fas fa-university text-emerald-600 text-xl"></i>
          <h3 className="font-semibold text-gray-800">
            {isPending ? "Đang chờ xác nhận" : "Tài khoản đang dùng"}
          </h3>
        </div>

        {isPending && bank.expired_at && (
          <span className="text-xs text-yellow-700">
            Hết hạn: {new Date(bank.expired_at).toLocaleString("vi-VN")}
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Ngân hàng:</span>
          <span className="font-medium">{bank.bank_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Số tài khoản:</span>
          <span className="font-mono font-medium">
            {bank.account_number_masked}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Chủ tài khoản:</span>
          <span className="font-medium">{bank.account_holder_name}</span>
        </div>
      </div>
    </div>
  );

  // loading screen
  if (loading && !bankData) {
    return (
      <InstructorProfileLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </InstructorProfileLayout>
    );
  }

  return (
    <InstructorProfileLayout>
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tài khoản ngân hàng</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {bankData?.active_bank ? "Cập nhật" : "Thêm mới"}
            </button>
          )}
        </div>

        {/* Pending Bank Warning */}
        {bankData?.pending_bank && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <i className="fas fa-exclamation-triangle text-yellow-600 mt-1"></i>
              <div className="flex-1">
                <p className="font-medium text-yellow-800">
                  Có yêu cầu cập nhật đang chờ xác nhận
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Vui lòng kiểm tra email và nhập mã xác nhận để hoàn tất cập
                  nhật.
                </p>
                <button
                  onClick={() => setShowConfirmDialog(true)}
                  className="mt-2 text-sm text-yellow-800 font-medium hover:underline"
                >
                  Nhập mã xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bank Items */}
        {!isEditing && (
          <div className="space-y-4 mb-6">
            {bankData?.active_bank && renderBankItem(bankData.active_bank)}
            {bankData?.pending_bank &&
              renderBankItem(bankData.pending_bank, true)}
            {!bankData?.active_bank && !bankData?.pending_bank && (
              <div className="text-center py-12 text-gray-500">
                <i className="fas fa-university text-4xl mb-3"></i>
                <p>Chưa có tài khoản ngân hàng</p>
                <p className="text-sm">Nhấn "Thêm mới" để thêm tài khoản</p>
              </div>
            )}
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Info box */}
            {bankData?.active_bank && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <i className="fas fa-info-circle mr-2"></i>
                Cập nhật sẽ tạo yêu cầu xác nhận mới. Tài khoản hiện tại vẫn
                hoạt động cho đến khi xác nhận thành công.
              </div>
            )}

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tên ngân hàng <span className="text-red-500">*</span>
              </label>
              <BankSelector
                value={formData.bank_name}
                onChange={(bankName, bankCode) => {
                  setFormData({ ...formData, bank_name: bankName });
                  if (errors.bank_name) {
                    setErrors({ ...errors, bank_name: "" });
                  }
                }}
                error={errors.bank_name}
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Số tài khoản <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.account_number ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập số tài khoản"
              />
              {errors.account_number && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.account_number}
                </p>
              )}
            </div>

            {/* Account Holder Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tên chủ tài khoản <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="account_holder_name"
                value={formData.account_holder_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.account_holder_name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Nhập tên chủ tài khoản"
              />
              {errors.account_holder_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.account_holder_name}
                </p>
              )}
            </div>

            {/* Form Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Đang xử lý..." : "Lưu thông tin"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        {/* Confirm OTP Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">
                Xác nhận tài khoản ngân hàng
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Nhập mã xác nhận đã được gửi đến email của bạn.
              </p>
              <form onSubmit={handleConfirm}>
                <input
                  type="text"
                  value={confirmToken}
                  onChange={(e) => setConfirmToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập mã xác nhận"
                />

                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? "Đang xác nhận..." : "Xác nhận"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowConfirmDialog(false);
                      setConfirmToken("");
                    }}
                    className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </InstructorProfileLayout>
  );
};

export default BankAccountPage;
