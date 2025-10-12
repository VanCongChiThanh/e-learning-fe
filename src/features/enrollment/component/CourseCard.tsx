import React from 'react';
import { Button } from '../common/UI';
import { Course } from '../type';

interface CourseCardProps {
  course: Course;
  onCourseClick: (courseId: string) => void;
  onEdit?: (courseId: string) => void;
  variant?: 'student' | 'instructor';
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onCourseClick,
  onEdit,
  variant = 'student',
}) => {
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'active': { label: 'Đang hoạt động', color: 'bg-green-100 text-green-800' },
      'draft': { label: 'Nháp', color: 'bg-yellow-100 text-yellow-800' },
      'archived': { label: 'Đã lưu trữ', color: 'bg-gray-100 text-gray-800' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const handleClick = () => {
    console.log("Course clicked:", course);
    onCourseClick(course.courseId);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(course.courseId);
    }
  };

  const statusInfo = getStatusDisplay(course.status);

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="text-blue-600 text-4xl font-bold">
              {course.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {course.title || `Khóa học ${course.courseId.slice(-6)}`}
          </h3>
        </div>

        {course.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Course Info */}
        <div className="space-y-2 mb-4">
          {course.instructor?.name && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Giảng viên:</span>
              <span className="ml-1">{course.instructor.name}</span>
            </div>
          )}
          
          {/* {variant === 'instructor' && course.enrollmentCount !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Học viên:</span>
              <span className="ml-1">{course.enrollmentCount}</span>
            </div>
          )} */}

          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Tạo:</span>
            <span className="ml-1">{new Date(course.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleClick}
            className="flex-1"
          >
            {variant === 'instructor' ? 'Quản lý' : 'Xem chi tiết'}
          </Button>
          
          {variant === 'instructor' && onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEdit}
              className="px-3"
            >
              Sửa
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};