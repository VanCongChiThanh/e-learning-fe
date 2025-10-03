import React, { useEffect, useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import { toast } from "react-toastify";
import "./Edit.scss";
import {
  getUserInfo,
  updateUserInfo,
  UserInfo,
  getInstructorProfile,
  updateInstructorProfile,
  InstructorProfile,
} from "../api";
import {
  getPresignedUrl,
  uploadFileToS3,
} from "../../../services/file-service";

const InstructorProfileEdit: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [instructor, setInstructor] = useState<InstructorProfile | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);

  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingInstructor, setLoadingInstructor] = useState(false);

  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingInstructor, setIsEditingInstructor] = useState(false);

  useEffect(() => {
    Promise.all([getUserInfo(), getInstructorProfile()]).then(
      ([userData, instructorData]) => {
        setUser(userData);
        setInstructor(instructorData);
        setAvatarUrl(userData.avatar || null);
        setPreviewAvatar(userData.avatar || null);
      }
    );
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setNewAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  // Cập nhật User Info
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoadingUser(true);

    try {
      let avatarToSave = avatarUrl;

      if (newAvatarFile) {
        const ext = "." + newAvatarFile.name.split(".").pop()?.toLowerCase();
        const { url, key } = await getPresignedUrl(ext);
        await uploadFileToS3(url, newAvatarFile);
        avatarToSave = `https://e-learning-data.s3.us-east-1.amazonaws.com/${encodeURIComponent(
          key
        )}`;
      }

      const updatedUser = await updateUserInfo({
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: avatarToSave || user.avatar,
      });

      setUser(updatedUser);
      setAvatarUrl(updatedUser.avatar);
      setNewAvatarFile(null);
    } catch (error) {
      console.error("Update User failed", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin cá nhân");
    } finally {
      setLoadingUser(false);
      toast.success("Cập nhật thông tin cá nhân thành công!");
    }
  };

  // Cập nhật Instructor Profile
  const handleUpdateInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructor) return;
    setLoadingInstructor(true);

    try {
      await updateInstructorProfile(instructor);
      alert("Cập nhật hồ sơ giảng viên thành công!");
    } catch (error) {
      console.error("Update Instructor failed", error);
      alert("Có lỗi xảy ra khi cập nhật hồ sơ giảng viên");
    } finally {
      setLoadingInstructor(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen py-8 px-4">
        <div className="page-header">
          <h5>
            <i className="fas fa-user-edit mr-3"></i>Cập Nhật Thông Tin Cá Nhân
          </h5>
          <p>Quản lý và cập nhật thông tin hồ sơ giảng viên của bạn</p>
        </div>

        {/* User Info */}
        <form className="profile-form" onSubmit={handleUpdateUser}>
          <div className="form-section relative">
            <h2 className="section-title flex justify-between items-center">
              <span>
                <i className="fas fa-id-card"></i> Thông Tin Cá Nhân
              </span>

              {!isEditingUser ? (
                <button
                  type="button"
                  className="text-blue-600"
                  onClick={() => setIsEditingUser(true)}
                title="Chỉnh sửa thông tin"
                >
                  <i className="fas fa-pen"></i>

                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn-save mr-2"
                    disabled={loadingUser}
                    title="Lưu thay đổi"
                  >
                    {loadingUser ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i
                        className="fas fa-save"
                        style={{ color: "#2600fdff" , fontSize: "1.5rem" }}
                      ></i>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsEditingUser(false)}
                    title="Hủy bỏ"
                  >
                    <i
                      className="fas fa-times"
                      style={{ color: "#fd1500ff", fontSize: "1.5rem" }}
                    ></i>
                  </button>
                </div>
              )}
            </h2>

            <div className="form-group">
              <label>
                Ảnh Đại Diện <span className="required">*</span>
              </label>
              <div className="avatar-upload">
                <div className="avatar-preview">
                  {previewAvatar ? (
                    <img src={previewAvatar} alt="avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                <div className="upload-controls">
                  <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() =>
                      document.getElementById("avatarInput")?.click()
                    }
                    disabled={!isEditingUser}
                  >
                    <i className="fas fa-cloud-upload-alt"></i> Tải Ảnh Lên
                  </button>
                  <p className="upload-hint">
                    JPG, PNG hoặc GIF. Kích thước tối đa 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label>Họ và Tên Đệm</label>
                <input
                  type="text"
                  value={user?.first_name || ""}
                  onChange={(e) =>
                    setUser(
                      (prev) => prev && { ...prev, first_name: e.target.value }
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label>Tên</label>
                <input
                  type="text"
                  value={user?.last_name || ""}
                  onChange={(e) =>
                    setUser(
                      (prev) => prev && { ...prev, last_name: e.target.value }
                    )
                  }
                />
              </div>
            </div>
          </div>
        </form>

        {/* Instructor Info */}
        <form className="profile-form mt-6" onSubmit={handleUpdateInstructor}>
          <div className="form-section">
            <h2 className="section-title flex justify-between items-center">
              <span>
                <i className="fas fa-briefcase"></i> Thông Tin Nghề Nghiệp
              </span>

              {!isEditingInstructor ? (
                <button
                  type="button"
                  className="text-blue-600"
                  onClick={() => setIsEditingInstructor(true)}
                  title="Chỉnh sửa thông tin"
                >
                  <i className="fas fa-pen"></i>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="p-2 rounded hover:bg-purple-50"
                    disabled={loadingInstructor}
                    title="Lưu thay đổi"
                  >
                    <i
                      className="fas fa-save"
                      style={{ color: "#2600fdff", fontSize: "1.5rem" }}
                    ></i>
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-red-50"
                    onClick={() => setIsEditingInstructor(false)}
                    title="Hủy bỏ"
                  >
                    <i
                      className="fas fa-times"
                      style={{ color: "#fd1500ff", fontSize: "1.5rem" }}
                    ></i>
                  </button>
                </div>
              )}
            </h2>
            <div className="form-group">
              <label>Tiêu Đề Chuyên Môn</label>
              <input
                type="text"
                value={instructor?.headline || ""}
                onChange={(e) =>
                  setInstructor(
                    (prev) => prev && { ...prev, headline: e.target.value }
                  )
                }
                maxLength={120}
              />
            </div>
            <div className="form-group">
              <label>Giới Thiệu Ngắn</label>
              <textarea
                value={instructor?.bio || ""}
                onChange={(e) =>
                  setInstructor(
                    (prev) => prev && { ...prev, bio: e.target.value }
                  )
                }
                maxLength={300}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Tiểu Sử Chi Tiết</label>
              <textarea
                value={instructor?.biography || ""}
                onChange={(e) =>
                  setInstructor(
                    (prev) => prev && { ...prev, biography: e.target.value }
                  )
                }
                maxLength={2000}
                rows={6}
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title flex justify-between items-center">
              <span>
                <i className="fas fa-briefcase"></i> Liên Kết Mạng Xã Hội
              </span>

              {!isEditingInstructor ? (
                <button
                  type="button"
                  className="text-blue-600"
                  onClick={() => setIsEditingInstructor(true)}
                    title="Chỉnh sửa thông tin"
                >
                  <i className="fas fa-pen"></i>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn-save"
                    disabled={loadingInstructor}
                    title="Lưu thay đổi"
                  >
                    <i
                      className="fas fa-save"
                      style={{ color: "#2600fdff", fontSize: "1.5rem" }}
                    ></i>
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsEditingInstructor(false)}
                    title="Hủy bỏ"
                  >
                    <i
                      className="fas fa-times"
                      style={{ color: "#fd1500ff", fontSize: "1.5rem" }}
                    ></i>
                  </button>
                </div>
              )}
            </h2>
            <div className="social-grid">
              <div className="form-group">
                <label>LinkedIn</label>
                <div className="social-input-group linkedin">
                  <i className="fab fa-linkedin social-icon"></i>
                  <input
                    type="url"
                    value={instructor?.linkedin || ""}
                    onChange={(e) =>
                      setInstructor(
                        (prev) => prev && { ...prev, linkedin: e.target.value }
                      )
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>GitHub</label>
                <div className="social-input-group github">
                  <i className="fab fa-github social-icon"></i>
                  <input
                    type="url"
                    value={instructor?.github || ""}
                    onChange={(e) =>
                      setInstructor(
                        (prev) => prev && { ...prev, github: e.target.value }
                      )
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Facebook</label>
                <div className="social-input-group facebook">
                  <i className="fab fa-facebook social-icon"></i>
                  <input
                    type="url"
                    value={instructor?.facebook || ""}
                    onChange={(e) =>
                      setInstructor(
                        (prev) => prev && { ...prev, facebook: e.target.value }
                      )
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>YouTube</label>
                <div className="social-input-group youtube">
                  <i className="fab fa-youtube social-icon"></i>
                  <input
                    type="url"
                    value={instructor?.youtube || ""}
                    onChange={(e) =>
                      setInstructor(
                        (prev) => prev && { ...prev, youtube: e.target.value }
                      )
                    }
                  />
                </div>
              </div>
              <div className="form-group md:col-span-2">
                <label>Website Cá Nhân</label>
                <div className="social-input-group website">
                  <i className="fas fa-globe social-icon"></i>
                  <input
                    type="url"
                    value={instructor?.personal_website || ""}
                    onChange={(e) =>
                      setInstructor(
                        (prev) =>
                          prev && {
                            ...prev,
                            personal_website: e.target.value,
                          }
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default InstructorProfileEdit;
