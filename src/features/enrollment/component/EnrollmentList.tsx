import React from 'react';
import { EnrollmentCard } from './EnrollmentCard';
import { EmptyState } from '../common/States';
import { Button } from '../common/UI';

interface EnrollmentListProps {
  filteredEnrollments: any[];
  onViewDetail: (enrollment: any) => void;
  onEdit: (enrollment: any) => void;
  onDelete: (enrollment: any) => void;
}

const EnrollmentList: React.FC<EnrollmentListProps> = ({
  filteredEnrollments,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  if (filteredEnrollments.length === 0) {
    return (
      <EmptyState
        title="Không tìm thấy enrollment nào"
        description="Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác."
        icon={
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Danh sách Enrollment</h3>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => console.log("Export enrollments")}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Xuất báo cáo
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEnrollments.map((enrollment: any) => (
          <EnrollmentCard
            key={enrollment.id}
            enrollment={enrollment}
            viewMode="admin"
            onViewDetail={onViewDetail}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={true}
          />
        ))}
      </div>
    </div>
  );
};

export default EnrollmentList;