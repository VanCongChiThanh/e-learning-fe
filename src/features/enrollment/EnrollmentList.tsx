import React from "react";
import { useEnrollments } from "../enrollment/hook/useEnrollment";
import { UUID } from "../enrollment/utils/UUID";

const EnrollmentList: React.FC<{ userId: UUID }> = ({ userId }) => {
  const { enrollments, loading, error, addEnrollment } = useEnrollments(userId);

  if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;
  return (
    <div>
      <h2>Danh sách khoá học</h2>
      <ul>
        {enrollments && enrollments?.length > 0 ? (
            enrollments.map((e) => <li key={e.id}>{e.courseId}</li>)
            ) : (
            <li>Chưa có khóa học nào</li>
            )}
      </ul>

      <button
        onClick={() =>                 
          addEnrollment(userId)
        }
      >
        Thêm khóa học
      </button>
    </div>
  );
};

export default EnrollmentList;
