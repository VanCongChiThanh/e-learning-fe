import { useEffect, useState } from "react";
import {
  getUserInfo,
  updateUserInfo,
  getPresignedUrl,
  uploadAvatarToS3,
  UserInfo,
} from "../api";

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
        await uploadAvatarToS3(url, newAvatarFile);
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

  if (loading && !user) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md relative">
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
          title="Edit"
        >
          <i className="fas fa-pen text-[#106c54] text-lg"></i>
        </button>
      )}

      <h2 className="text-2xl font-bold mb-6 text-center">Thông tin cá nhân</h2>

      {user && (
        <>
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={
                previewAvatar ||
                avatarUrl ||
                `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`
              }
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="text-sm"
              />
            )}
          </div>

          {/* First name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">First name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                isEditing
                  ? "focus:ring-[#106c54]/50"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Last name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                isEditing
                  ? "focus:ring-[#106c54]/50"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          {isEditing && (
            <div className="flex gap-3">
              {/* Save */}
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 py-2 bg-[#106c54] text-white font-semibold rounded-lg hover:opacity-90 disabled:bg-gray-400 flex items-center justify-center gap-2"
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
    </div>
  );
}

export default LearnerProfileEdit;