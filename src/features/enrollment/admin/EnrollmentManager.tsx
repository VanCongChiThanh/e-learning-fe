import React, { useState, useMemo } from 'react';
import { Search, Users, BookOpen, TrendingUp, Filter, Eye, Edit2, Calendar, Award, Pen, NotebookIcon } from 'lucide-react';
import { useEnrollments } from '../hook/useEnrollment';
import { UUID } from '../utils/UUID';
import { formatDate } from '../utils/formatDate';
import CardAdmin from '../../../components/Enrollment/CardAdmin';
import Table from '../../../components/Enrollment/Table';
import ViewDetail from '../../../components/Enrollment/ViewDetail';
const EnrollmentManagement = () => {
  const [filterUserId, setFilterUserId] = useState('');
  const [filterCourseId, setFilterCourseId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, user, course
  
  // Sử dụng hook với filter
  const currentUserId = activeFilter === 'user' && filterUserId ? filterUserId : undefined;
  const currentCourseId = activeFilter === 'course' && filterCourseId ? filterCourseId : undefined;
  
  const {
    enrollments,
    selectedEnrollment,
    setSelectedEnrollment,
    loading,
    error,
    fetchEnrollments,
    fetchEnrollmentById,
  } = useEnrollments(currentUserId as UUID, currentCourseId as UUID);

    const columns = [
        { header: "ID", accessor: "id", render: (row: any) => row.id?.substring(0, 8) + "..." },
        { header: "ID Khóa học", accessor: "courseId", render: (row: any) => row.courseId.substring(0, 8) + "..." },
        { header: "ID User", accessor: "userId", render: (row: any) => row.userId.substring(0, 8) + "..."},
        {
            header: "Ngày Đăng Ký",
            accessor: "enrollment_date",
            render: (row: any) => (
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {row.enrollmentDate? formatDate(row.enrollmentDate) : "Chưa có"}
                </div>
            ),
        },
        {
            header: "Trạng Thái",
            accessor: "status",
            render: (row: any) => (
                <div className="flex items-center">
                <NotebookIcon
                    className={`w-4 h-4 mr-2 ${getStatusColor(row.status)}`}
                />
                <span className={getStatusColor(row.status)}>
                    {row.status || "Chưa có"}
                </span>
                </div>
            ),
        },
        {
            header: "Thao tác",
            accessor: "actions",
            render: (row: any) => (
                <div className="flex space-x-4">
                    <button
                        onClick={() => fetchEnrollmentById(row.id)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

  // Tính toán thống kê
  const statistics = useMemo(() => {
    const total = enrollments.length;
    const completed = enrollments.filter(e => e.status === 'COMPLETED').length;
    const inProgress = enrollments.filter(e => e.status === 'ACTIVE').length;
    const completionRate = total > 0 ? (completed / total * 100).toFixed(1) : '0';
    
    return {
      totalEnrollments: total,
      completedEnrollments: completed,
      inProgressEnrollments: inProgress,
      completionRate: parseFloat(completionRate)
    };
  }, [enrollments]);

  // Lọc enrollments theo search term
  const filteredEnrollments = useMemo(() => {
    if (!searchTerm) return enrollments;
    return enrollments.filter(enrollment => 
      enrollment.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.courseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [enrollments, searchTerm]);

  const handleFilterChange = (type: string) => {
    setActiveFilter(type);
    if (type === 'all') {
      setFilterUserId('');
      setFilterCourseId('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'ACTIVE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && enrollments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu enrollment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Enrollment</h1>
          <p className="text-gray-600">Theo dõi và quản lý tất cả enrollment trong hệ thống</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <CardAdmin statistics={statistics.totalEnrollments} icons={Users} title="Tổng Enrollment" />
            <CardAdmin statistics={statistics.completedEnrollments} icons={Award} title="Đã Hoàn Thành" />
            <CardAdmin statistics={statistics.inProgressEnrollments} icons={BookOpen} title="Đang Học" />
            <CardAdmin statistics={statistics.completionRate} icons={TrendingUp} title="Tỷ Lệ Hoàn Thành" />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tất Cả
              </button>
              <button
                onClick={() => handleFilterChange('user')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'user' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Theo User
              </button>
              <button
                onClick={() => handleFilterChange('course')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'course' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Theo Course
              </button>
            </div>

            {/* Filter Inputs */}
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
              {activeFilter === 'user' && (
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Nhập User ID để lọc..."
                    value={filterUserId}
                    onChange={(e) => setFilterUserId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              
              {activeFilter === 'course' && (
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Nhập Course ID để lọc..."
                    value={filterCourseId}
                    onChange={(e) => setFilterCourseId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm enrollment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={fetchEnrollments}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Filter className="w-4 h-4 inline mr-2" />
                {loading ? 'Đang tải...' : 'Áp dụng'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Enrollments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh Sách Enrollment ({filteredEnrollments.length})
            </h2>
          </div>

          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không có enrollment nào được tìm thấy</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
                <Table columns={columns} data={filteredEnrollments} />
            </div>
          )}
        </div>

        {/* Selected Enrollment Details Modal */}
        {selectedEnrollment && (
          <ViewDetail selectedEnrollment={selectedEnrollment} setSelectedEnrollment={setSelectedEnrollment} />
        )}
      </div>
    </div>
  );
};

export default EnrollmentManagement;