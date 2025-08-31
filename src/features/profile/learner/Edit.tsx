import { useEffect, useState } from "react";
import {
  getUserInfo,
  updateUserInfo,
  getPresignedUrl,
  uploadAvatarToS3,
  UserInfo,
} from "../api";

function UserInfoPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserInfo();
        setUser(data);
        setFirstName(data.first_name);
        setLastName(data.last_name);
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
      const updated = await updateUserInfo({
        first_name: firstName,
        last_name: lastName,
      });
      setUser(updated);
      alert("Profile updated!");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      // 1. Lấy presigned URL
      const { url, key } = await getPresignedUrl(
        file.name,
        file.type,
        "avatars"
      );

      // 2. Upload file trực tiếp lên S3
      await uploadAvatarToS3(url, file);

      // 3. Gọi BE cập nhật avatar key/url
      const updated = await updateUserInfo({ avatar: key });
      setUser(updated);

      alert("Avatar updated!");
    } catch (err) {
      console.error("Upload avatar failed", err);
      alert("Upload avatar failed");
    }
  };

  if (loading && !user) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2>User Profile</h2>

      {user && (
        <>
          <div style={{ marginBottom: 20 }}>
            <img
              src={
                user.avatar ? user.avatar : "https://via.placeholder.com/150"
              }
              alt="avatar"
              width={150}
              height={150}
              style={{ borderRadius: "50%" }}
            />
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div>
            <label>First name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ display: "block", marginBottom: 10 }}
            />
          </div>

          <div>
            <label>Last name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ display: "block", marginBottom: 10 }}
            />
          </div>

          <button onClick={handleSave} disabled={loading}>
            Save
          </button>
        </>
      )}
    </div>
  );
}

export default UserInfoPage;
