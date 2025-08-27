import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return <p>Đang tải thông tin...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Trang cá nhân</h1>
      <p>
        <strong>Họ tên:</strong> {user.first_name} {user.last_name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Vai trò:</strong> {user.role}
      </p>
    </div>
  );
};

export default ProfilePage;
