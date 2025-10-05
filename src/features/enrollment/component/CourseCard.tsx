import React from 'react';
import { UUID } from '../utils/UUID';
import { Button } from '../common/UI';

interface CourseCardProps {
  course: {
    courseId: UUID;
    title: string;
    slug: string;
    description?: string;
    category: string;
    level: string;
    status: string;
    instructorId: string;
    createdAt: number; // timestamp
    image: string;
  };
  onSelectCourse: (courseId: UUID) => void;
  onEditCourse?: (courseId: UUID) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onSelectCourse,
  onEditCourse,
}) => {

    const getCategoryDisplay = (category: string) => {
    const categoryMap: Record<string, string> = {
      'DESIGN': 'Thiết kế',
      'DEVELOPMENT': 'Lập trình',
      'BUSINESS': 'Kinh doanh',
      'MARKETING': 'Marketing',
      'LANGUAGE': 'Ngôn ngữ'
    };
    return categoryMap[category] || category;
  };

  const getLevelDisplay = (level: string) => {
    const levelMap: Record<string, string> = {
      'BEGINNER': 'Cơ bản',
      'INTERMEDIATE': 'Trung cấp',
      'ADVANCED': 'Nâng cao'
    };
    return levelMap[level] || level;
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'PUBLISHED': { label: 'Đã xuất bản', color: 'bg-green-100 text-green-800' },
      'DRAFT': { label: 'Bản nháp', color: 'bg-gray-100 text-gray-800' },
      'ARCHIVED': { label: 'Đã lưu trữ', color: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const statusInfo = getStatusDisplay(course.status);

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
      {/* Course Image */}
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMzUgOTBMMTIwIDc1VjEyNUwxMzUgMTEwTDE1MCA5NUwxODAgMTI1VjE0MEgxNDBIMTIwVjEyNUwxMzUgMTEwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
          }}
        />
      </div>

      <div className="p-6">
        {/* Header with title and status */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 flex-1 mr-2">
            {course.title || `Khóa học ${course.courseId.slice(-6)}`}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description || 'Chưa có mô tả'}
        </p>
        
        {/* Course Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Danh mục:</span>
            <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {getCategoryDisplay(course.category)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Cấp độ:</span>
            <span className="font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
              {getLevelDisplay(course.level)}
            </span>
          </div>
        </div>

        {/* Course ID (collapsed) */}
        <details className="mb-4">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
            Thông tin kỹ thuật
          </summary>
          <div className="mt-2 space-y-1 text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div className="flex justify-between">
              <span>Course ID:</span>
              <span className="font-mono">{course.courseId}</span>
            </div>
            <div className="flex justify-between">
              <span>Slug:</span>
              <span className="font-mono">{course.slug}</span>
            </div>
            <div className="flex justify-between">
              <span>Instructor ID:</span>
              <span className="font-mono">{course.instructorId}</span>
            </div>
          </div>
        </details>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onSelectCourse(course.courseId)}
            className="flex-1"
          >
            Xem học viên
          </Button>
          {onEditCourse && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEditCourse(course.courseId)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};