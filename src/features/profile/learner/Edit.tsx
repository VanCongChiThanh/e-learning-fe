import { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo, UserInfo } from "../api";
import {
  getPresignedUrl,
  uploadFileToS3,
} from "../../../services/file-service";
import ProfileLayout from "./ProfileLayout";
function LearnerProfileEdit() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // avatar hiện tại
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null); // avatar mới chọn
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserInfo();
        setUser(data);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setAvatarUrl(data.avatar || null);
      } catch (err) {
        console.error("Failed to load user info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let avatarToSave = avatarUrl;

      // Nếu có file mới thì upload trước
      if (newAvatarFile) {
        const ext = "." + newAvatarFile.name.split(".").pop()?.toLowerCase();
        const { url, key } = await getPresignedUrl(ext);
        await uploadFileToS3(url, newAvatarFile);
        avatarToSave = `https://e-learning-data.s3.us-east-1.amazonaws.com/${encodeURIComponent(
          key
        )}`;
      }

      const updated = await updateUserInfo({
        first_name: firstName,
        last_name: lastName,
        avatar: avatarToSave || user.avatar,
      });

      setUser(updated);
      setAvatarUrl(updated.avatar);
      setPreviewAvatar(avatarToSave);
      setNewAvatarFile(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setNewAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file)); // chỉ preview
  };

  return (
    <ProfileLayout>
      <div className="max-w-md mx-auto relative">
        {loading && !user ? (
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-4xl text-emerald-600 mb-4"></i>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-0 right-0 p-2 rounded-lg hover:bg-gray-100"
                title="Edit"
              >
                <i className="fas fa-pen text-[#106c54] text-lg"></i>
              </button>
            )}

            <h2 className="text-2xl font-bold mb-6 text-center">
              Thông tin cá nhân
            </h2>

            {user && (
              <>
                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32 group">
                    <img
                      src={
                        previewAvatar ||
                        avatarUrl ||
                        `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`
                      }
                      alt="avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />

                    {/* Camera icon - only show when editing */}
                    {isEditing && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                        <i className="fas fa-camera text-white text-2xl"></i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* First name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Họ</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                      isEditing
                        ? "focus:ring-emerald-500/50 border-gray-300"
                        : "bg-gray-100 cursor-not-allowed border-gray-200"
                    }`}
                  />
                </div>

                {/* Last name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Tên</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                      isEditing
                        ? "focus:ring-emerald-500/50 border-gray-300"
                        : "bg-gray-100 cursor-not-allowed border-gray-200"
                    }`}
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-3 mt-6">
                    {/* Save */}
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-save"></i>
                      {loading ? "Saving..." : "Save"}
                    </button>

                    {/* Cancel */}
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setPreviewAvatar(null);
                        setNewAvatarFile(null);
                        if (user) {
                          setFirstName(user.first_name);
                          setLastName(user.last_name);
                        }
                      }}
                      className="flex-1 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </ProfileLayout>
  );
}

export default LearnerProfileEdit;
