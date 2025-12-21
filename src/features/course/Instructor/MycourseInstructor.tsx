import React, { useEffect, useState, useMemo } from "react";
import axiosAuth from "../../../api/axiosAuth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
interface Course {
  courseId: string;
  title: string;
  description: string;
  image: string;
  level: string;
  category: string;
  status?: string;
  totalStudents?: number;
  createdAt?: number;
}

const MyCoursesInstructor: React.FC = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [searchedCourses, setSearchedCourses] = useState<Course[] | null>(null);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });

  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const itemsPerPage = 10;
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchAllCoursesAndSetStats() {
      setLoading(true);
      try {
        const res = await axiosAuth.get("/courses/instructor", {
          params: {
            order: "desc",
            page: 1,
            paging: 10,
            sort: "created_at",
          },
        });

        let coursesData = res.data.data;
        const totalPages = res.data.meta.total_pages;

        if (totalPages > 1) {
          const promises = [];
          for (let page = 2; page <= totalPages; page++) {
            promises.push(
              axiosAuth.get("/courses/instructor", {
                params: {
                  order: "desc",
                  page: page,
                  paging: 10,
                  sort: "created_at",
                },
              })
            );
          }

          const responses = await Promise.all(promises);
          responses.forEach((response) => {
            if (response.data.data) {
              coursesData = [...coursesData, ...response.data.data];
            }
          });
        }

        setAllCourses(coursesData);
        setStats({
          total: coursesData.length,
          published: coursesData.filter((c: Course) => c.status === "PUBLISHED")
            .length,
          draft: coursesData.filter((c: Course) => c.status === "DRAFT").length,
        });
      } catch (error) {
        console.error("Failed to fetch courses", error);
        setAllCourses([]);
      }
      setLoading(false);
    }
    fetchAllCoursesAndSetStats();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchedCourses(null);
      setCurrentPage(1);
      return;
    }

    setIsSearching(true);
    try {
      const escapedQuery = searchTerm.trim().replace(/'/g, "\\'");
      const filterString = `title ~ '*${escapedQuery}*'`;

      const res = await axiosAuth.get("/courses/instructor", {
        params: {
          order: "desc",
          page: 1,
          paging: 1000, // Lấy tất cả kết quả tìm kiếm
          sort: "created_at",
          filter: filterString,
        },
      });
      setSearchedCourses(res.data.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to search courses", error);
      setSearchedCourses([]);
    } finally {
      setIsSearching(false);
    }
  };

  const coursesForClientFilter =
    searchedCourses !== null ? searchedCourses : allCourses;

  const uniqueCategories = useMemo(() => {
    if (allCourses.length === 0) return ["ALL"];
    const categories = new Set(
      allCourses.map((c: Course) => c.category).filter(Boolean)
    );
    return ["ALL", ...Array.from(categories)];
  }, [allCourses]);

  const filteredCourses = useMemo(() => {
    return coursesForClientFilter
      .filter((course: Course) => {
        if (statusFilter === "ALL") return true;
        return course.status === statusFilter;
      })
      .filter((course: Course) => {
        if (categoryFilter === "ALL") return true;
        return course.category === categoryFilter;
      });
  }, [coursesForClientFilter, statusFilter, categoryFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter]);

  // Logic phân trang phía Client
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-800";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800";
      case "ADVANCED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "DEVELOPMENT":
        return "bg-blue-100 text-blue-800";
      case "BUSINESS":
        return "bg-purple-100 text-purple-800";
      case "DESIGN":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#106c54] to-[#0d5a45] text-white">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-2">Quản lý khóa học</h1>
          <p className="text-green-100">
            Theo dõi và quản lý tất cả khóa học của bạn
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              to="/instructor/courses/create"
              className="bg-white text-[#106c54] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              + Tạo khóa học mới
            </Link>
            <button
              className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-[#106c54] transition-colors"
              onClick={() => navigate("/teacher/enrollments")}
            >
              Thống kê
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-[#106c54]">
              {stats.total}
            </div>
            <div className="text-gray-600">Tổng khóa học</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.published}
            </div>
            <div className="text-gray-600">Đã xuất bản</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.draft}
            </div>
            <div className="text-gray-600">Bản nháp</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <select
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#106c54]"
              value={statusFilter}
              onChange={(e) => {
                setSearchedCourses(null);
                setStatusFilter(e.target.value);
              }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đã xuất bản</option>
              <option value="DRAFT">Bản nháp</option>
            </select>
            <select
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#106c54]"
              value={categoryFilter}
              onChange={(e) => {
                setSearchedCourses(null);
                setCategoryFilter(e.target.value);
              }}
            >
              {uniqueCategories.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat === "ALL" ? "Tất cả danh mục" : cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#106c54]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="bg-[#106c54] text-white px-6 py-2 rounded-lg hover:bg-[#0d5a45] transition-colors"
            >
              <i className="fas fa-search mr-2"></i>
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Course List */}
        {loading || isSearching ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106c54]"></div>
          </div>
        ) : !currentCourses.length ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-graduation-cap text-6xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không tìm thấy khóa học
            </h3>
            <p className="text-gray-500 mb-6">
              Không có khóa học nào phù hợp với bộ lọc của bạn. Hãy thử lại hoặc
              tạo khóa học mới.
            </p>
            <Link
              to="/instructor/courses/create"
              className="inline-block bg-[#106c54] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0d5a45] transition-colors"
            >
              Tạo khóa học mới
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {currentCourses.map((course: Course) => (
              <div
                key={course.courseId}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Course Image */}
                  <div className="md:w-64 h-48 md:h-auto">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    />
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                            course.level
                          )}`}
                        >
                          {course.level}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            course.category
                          )}`}
                        >
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <i className="fas fa-users"></i>
                        <span>{course.totalStudents || 0} học viên</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <i className="fas fa-star text-yellow-500"></i>
                        <span>4.5 (25 đánh giá)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <i className="fas fa-clock"></i>
                        <span>Cập nhật gần đây</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <Link
                          to={`/instructor/courses/${course.courseId}/edit`}
                          className="flex items-center gap-2 px-4 py-2 bg-[#106c54] text-white rounded-lg hover:bg-[#0d5a45] transition-colors"
                        >
                          <i className="fas fa-edit"></i>
                          Chỉnh sửa
                        </Link>
                        <Link
                          to={`/instructor/courses/${course.courseId}/detail`}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <i className="fas fa-cog"></i>
                          Quản lý nội dung
                        </Link>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <i className="fas fa-chart-line"></i>
                          Thống kê
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            course.status === "PUBLISHED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.status === "PUBLISHED"
                            ? "Đã xuất bản"
                            : "Bản nháp"}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2 pb-8">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt; Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1
                        ? "bg-[#106c54] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau &gt;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesInstructor;
