import React from 'react';
import { Input, Select } from '../common/UI';

interface FilterSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeFilter: string;
  setActiveFilter: (value: string) => void;
  filterUserId: string;
  setFilterUserId: (value: string) => void;
  filterCourseId: string;
  setFilterCourseId: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  filterUserId,
  setFilterUserId,
  filterCourseId,
  setFilterCourseId,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc và tìm kiếm</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          label="Tìm kiếm"
          type="text"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="ID enrollment, course, user..."
        />
        
        <Select
          label="Loại bộ lọc"
          value={activeFilter}
          onChange={setActiveFilter}
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'user', label: 'Theo User ID' },
            { value: 'course', label: 'Theo Course ID' },
          ]}
        />

        {activeFilter === 'user' && (
          <Input
            label="User ID"
            type="text"
            value={filterUserId}
            onChange={setFilterUserId}
            placeholder="Nhập User ID"
          />
        )}

        {activeFilter === 'course' && (
          <Input
            label="Course ID"
            type="text"
            value={filterCourseId}
            onChange={setFilterCourseId}
            placeholder="Nhập Course ID"
          />
        )}
      </div>

      <div className="text-sm text-gray-600">
        Hiển thị {filteredCount} / {totalCount} enrollment
      </div>
    </div>
  );
};

export default FilterSection;