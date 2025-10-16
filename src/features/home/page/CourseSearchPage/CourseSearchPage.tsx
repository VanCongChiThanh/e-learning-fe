import React, { useEffect, useState } from "react";
import "./CourseSearchPage.scss";
import MainLayout from "../../../../layouts/MainLayout";
import { searchCourses } from "../../api";
import { Link, useSearchParams } from "react-router-dom";

// Reusable Filter Section Component
interface FilterSectionProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  getLabel: (value: string) => string;
  maxVisible?: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedValues,
  onToggle,
  getLabel,
  maxVisible = 5,
}) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, maxVisible);
  const hasMore = options.length > maxVisible;

  return (
    <div className="filter-section">
      <h4>{title}</h4>
      <div className="filter-options">
        {visibleOptions.map((value) => (
          <label key={value} className="checkbox-label">
            <input
              type="checkbox"
              value={value}
              checked={selectedValues.includes(value)}
              onChange={() => onToggle(value)}
            />
            <span>{getLabel(value)}</span>
          </label>
        ))}
      </div>
      {hasMore && (
        <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Ẩn bớt" : "Xem thêm"}
        </button>
      )}
    </div>
  );
};

interface Tag {
  tagId: string;
  name: string;
}

interface Course {
  courseId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  status: string;
  level: string;
  instructorId: string;
  category: string;
  image: string;
  tags: Tag[];
  averageRating: number;
  totalReviews: number;
  totalLectures: number;
  totalStudents: number;
  createdAt: string;
}

interface PageInfo {
  current_page: number;
  next_page: number;
  prev_page: number;
  total_pages: number;
  total_count: number;
}

const CATEGORIES = [
  "ALL",
  "PROGRAMMING",
  "DESIGN",
  "PROJECT_MANAGEMENT",
  "DATA_SCIENCE",
  "LANGUAGE_LEARNING",
  "DEVELOPMENT",
  "WEB_DEVELOPMENT",
  "MOBILE_DEVELOPMENT",
  "AI_AND_MACHINE_LEARNING",
  "CYBERSECURITY",
  "CLOUD_COMPUTING",
  "DEVOPS",
  "GAME_DEVELOPMENT",
  "SOFTWARE_ENGINEERING",
  "DATABASES",
];

const LEVELS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

const CourseSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || []
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    searchParams.get("level")?.split(",").filter(Boolean) || []
  );
  const [minPrice, setMinPrice] = useState<number | null>(
    searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : null
  );
  const [maxPrice, setMaxPrice] = useState<number | null>(
    searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : null
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "created_at"
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("order") || "desc"
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    current_page: 1,
    next_page: 1,
    prev_page: 1,
    total_pages: 1,
    total_count: 0,
  });

  // Sync state with URL params when URL changes (e.g., from Header search)
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setSelectedCategories(
      searchParams.get("category")?.split(",").filter(Boolean) || []
    );
    setSelectedLevels(
      searchParams.get("level")?.split(",").filter(Boolean) || []
    );
    setMinPrice(
      searchParams.get("minPrice")
        ? parseFloat(searchParams.get("minPrice")!)
        : null
    );
    setMaxPrice(
      searchParams.get("maxPrice")
        ? parseFloat(searchParams.get("maxPrice")!)
        : null
    );
    setSortBy(searchParams.get("sort") || "created_at");
    setSortOrder(searchParams.get("order") || "desc");
    setCurrentPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams]);

  // Update URL params when filters change
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    // Update or remove search query
    if (searchQuery) {
      newParams.set("q", searchQuery);
    } else {
      newParams.delete("q");
    }

    // Update or remove categories (multiple)
    if (selectedCategories.length > 0) {
      newParams.set("category", selectedCategories.join(","));
    } else {
      newParams.delete("category");
    }

    // Update or remove levels (multiple)
    if (selectedLevels.length > 0) {
      newParams.set("level", selectedLevels.join(","));
    } else {
      newParams.delete("level");
    }

    // Update or remove price range
    if (minPrice !== null) {
      newParams.set("minPrice", minPrice.toString());
    } else {
      newParams.delete("minPrice");
    }

    if (maxPrice !== null) {
      newParams.set("maxPrice", maxPrice.toString());
    } else {
      newParams.delete("maxPrice");
    }

    // Update or remove sort
    if (sortBy !== "created_at") {
      newParams.set("sort", sortBy);
    } else {
      newParams.delete("sort");
    }

    // Update or remove order
    if (sortOrder !== "desc") {
      newParams.set("order", sortOrder);
    } else {
      newParams.delete("order");
    }

    // Update or remove page
    if (currentPage !== 1) {
      newParams.set("page", currentPage.toString());
    } else {
      newParams.delete("page");
    }

    setSearchParams(newParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    selectedCategories,
    selectedLevels,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  // Build Spring Filter string
  const buildFilterString = () => {
    const filters: string[] = [];

    // Filter by categories (multiple)
    if (selectedCategories.length > 0) {
      const categoryFilter = `category in (${selectedCategories
        .map((cat) => `'${cat}'`)
        .join(",")})`;
      filters.push(categoryFilter);
    }

    // Filter by levels (multiple)
    if (selectedLevels.length > 0) {
      const levelFilter = `level in (${selectedLevels
        .map((level) => `'${level}'`)
        .join(",")})`;
      filters.push(levelFilter);
    }

    // Filter by price range
    if (minPrice !== null) {
      filters.push(`price >: ${minPrice}`);
    }
    if (maxPrice !== null) {
      filters.push(`price <: ${maxPrice}`);
    }

    // Filter by search query (title contains)
    if (searchQuery) {
      // Escape single quotes in search query
      const escapedQuery = searchQuery.replace(/'/g, "\\'");
      const searchFilter = `title ~ '*${escapedQuery}*'`;
      filters.push(searchFilter);
    }

    // Combine all filters with 'and'
    return filters.length > 0 ? filters.join(" and ") : undefined;
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const filterString = buildFilterString();

      const response = await searchCourses({
        page: currentPage,
        paging: 12,
        sort: sortBy === "totalStudents" ? "total_students" : sortBy,
        order: sortOrder,
        filter: filterString,
      });

      if (response.status === "success") {
        setCourses(response.data);
        setPageInfo(response.meta);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    sortBy,
    sortOrder,
    selectedCategories,
    selectedLevels,
    minPrice,
    maxPrice,
    searchQuery,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      PROGRAMMING: "Lập trình",
      DESIGN: "Thiết kế",
      PROJECT_MANAGEMENT: "Quản lý dự án",
      DATA_SCIENCE: "Khoa học dữ liệu",
      LANGUAGE_LEARNING: "Học ngôn ngữ",
      DEVELOPMENT: "Phát triển phần mềm",
      WEB_DEVELOPMENT: "Phát triển Web",
      MOBILE_DEVELOPMENT: "Phát triển Mobile",
      AI_AND_MACHINE_LEARNING: "AI & Machine Learning",
      CYBERSECURITY: "An ninh mạng",
      CLOUD_COMPUTING: "Điện toán đám mây",
      DEVOPS: "DevOps",
      GAME_DEVELOPMENT: "Phát triển Game",
      SOFTWARE_ENGINEERING: "Kỹ thuật phần mềm",
      DATABASES: "Cơ sở dữ liệu",
      ALL: "Tất cả",
    };
    return labels[category] || category;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      BEGINNER: "Cơ bản",
      INTERMEDIATE: "Trung cấp",
      ADVANCED: "Nâng cao",
      EXPERT: "Chuyên gia",
      ALL: "Tất cả",
    };
    return labels[level] || level;
  };

  const getPageTitle = () => {
    if (searchQuery) {
      return `Kết quả tìm kiếm cho "${searchQuery}"`;
    }
    if (selectedCategories.length === 1) {
      return `Khóa học ${getCategoryLabel(selectedCategories[0])}`;
    }
    if (selectedCategories.length > 1) {
      return `Khóa học ${selectedCategories
        .map((cat) => getCategoryLabel(cat))
        .join(", ")}`;
    }
    if (selectedLevels.length > 0) {
      return `Tất cả khóa học`;
    }
    return "Tất cả khóa học";
  };

  return (
    <MainLayout>
      <div className="course-search-page">
        {/* Main Content with Sidebar */}
        <section className="main-content">
          <div className="container">
            <div className="content-wrapper">
              {/* Left Sidebar - Filters */}
              <aside className="sidebar-filters">
                <div className="filter-header">
                  <h3>Lọc theo</h3>
                  {(selectedCategories.length > 0 ||
                    selectedLevels.length > 0 ||
                    minPrice !== null ||
                    maxPrice !== null) && (
                    <button
                      className="clear-all-filters"
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedLevels([]);
                        setMinPrice(null);
                        setMaxPrice(null);
                      }}
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  )}
                </div>

                <FilterSection
                  title="Chủ đề"
                  options={CATEGORIES.filter((cat) => cat !== "ALL")}
                  selectedValues={selectedCategories}
                  onToggle={(cat) => {
                    if (selectedCategories.includes(cat)) {
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== cat)
                      );
                    } else {
                      setSelectedCategories([...selectedCategories, cat]);
                    }
                  }}
                  getLabel={getCategoryLabel}
                />

                <FilterSection
                  title="Cấp độ"
                  options={LEVELS.filter((level) => level !== "ALL")}
                  selectedValues={selectedLevels}
                  onToggle={(level) => {
                    if (selectedLevels.includes(level)) {
                      setSelectedLevels(
                        selectedLevels.filter((l) => l !== level)
                      );
                    } else {
                      setSelectedLevels([...selectedLevels, level]);
                    }
                  }}
                  getLabel={getLevelLabel}
                />

                <div className="filter-section">
                  <h4>Khoảng giá</h4>
                  <div className="filter-options price-filter">
                    <div className="price-input-group">
                      <label htmlFor="min-price">Từ (VNĐ)</label>
                      <input
                        id="min-price"
                        type="number"
                        placeholder="0"
                        value={minPrice || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setMinPrice(value ? parseFloat(value) : null);
                        }}
                        min="0"
                      />
                    </div>
                    <div className="price-input-group">
                      <label htmlFor="max-price">Đến (VNĐ)</label>
                      <input
                        id="max-price"
                        type="number"
                        placeholder="10000000"
                        value={maxPrice || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setMaxPrice(value ? parseFloat(value) : null);
                        }}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </aside>

              {/* Right Content - Results */}
              <div className="courses-content">
                <div className="results-header">
                  <div className="results-info">
                    <h2>{getPageTitle()}</h2>
                    <p>{pageInfo.total_count || courses.length} kết quả</p>
                  </div>
                  <div className="sort-section">
                    <label htmlFor="sort-select">Sắp xếp theo:</label>
                    <select
                      id="sort-select"
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [newSort, newOrder] = e.target.value.split("-");
                        setSortBy(newSort);
                        setSortOrder(newOrder);
                      }}
                      aria-label="Sắp xếp"
                    >
                      <option value="created_at-desc">Mới nhất</option>
                      <option value="created_at-asc">Cũ nhất</option>
                      <option value="title-asc">A-Z</option>
                      <option value="title-desc">Z-A</option>
                      <option value="price-asc">Giá: Thấp đến Cao</option>
                      <option value="price-desc">Giá: Cao đến Thấp</option>
                      <option value="totalStudents-desc">Phổ biến nhất</option>
                    </select>
                  </div>
                </div>

                {/* Courses Grid */}
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Đang tải khóa học...</p>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="empty-state">
                    <svg
                      width="120"
                      height="120"
                      viewBox="0 0 120 120"
                      fill="none"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#e5e7eb"
                        strokeWidth="4"
                      />
                      <path
                        d="M40 60h40M60 40v40"
                        stroke="#9ca3af"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <h3>Không tìm thấy khóa học</h3>
                    <p>Thử điều chỉnh bộ lọc hoặc tìm kiếm từ khóa khác</p>
                  </div>
                ) : (
                  <div className="courses-grid">
                    {courses.map((course) => (
                      <Link
                        to={`/courses/${course.slug}`}
                        key={course.courseId}
                        className="course-card"
                      >
                        <div className="course-image">
                          <img
                            src={
                              course.image ||
                              "https://via.placeholder.com/400x225?text=Course"
                            }
                            alt={course.title}
                          />
                          <span className="course-level">{course.level}</span>
                        </div>

                        <div className="course-content">
                          <div className="course-category">
                            {course.category}
                          </div>
                          <h3 className="course-title">{course.title}</h3>
                          <p className="course-description">
                            {course.description}
                          </p>

                          <div className="course-meta">
                            <div className="rating">
                              <span className="rating-value">
                                {course.averageRating?.toFixed(1) || "5.0"}
                              </span>
                              <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill={
                                      i < Math.floor(course.averageRating || 5)
                                        ? "#f59e0b"
                                        : "#e5e7eb"
                                    }
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="review-count">
                                ({course.totalReviews || 0})
                              </span>
                            </div>

                            <div className="course-stats">
                              <div className="stat">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <span>
                                  {course.totalStudents || 0} học viên
                                </span>
                              </div>
                              <div className="stat">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <span>{course.totalLectures || 0} bài học</span>
                              </div>
                            </div>
                          </div>

                          <div className="course-footer">
                            <div className="course-price">
                              {course.price === 0 ? (
                                <span className="price-free">Miễn phí</span>
                              ) : (
                                <span className="price">
                                  {formatPrice(course.price)}
                                </span>
                              )}
                            </div>
                            <div className="course-tags">
                              {course.tags?.slice(0, 2).map((tag) => (
                                <span key={tag.tagId} className="tag">
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {!loading && courses.length > 0 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M15 18l-6-6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Trước
                    </button>

                    <div className="pagination-pages">
                      {[...Array(Math.min(5, pageInfo.total_pages))].map(
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              className={`pagination-page ${
                                currentPage === pageNum ? "active" : ""
                              }`}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      {pageInfo.total_pages > 5 && (
                        <>
                          <span className="pagination-dots">...</span>
                          <button
                            className="pagination-page"
                            onClick={() =>
                              handlePageChange(pageInfo.total_pages)
                            }
                          >
                            {pageInfo.total_pages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pageInfo.total_pages}
                    >
                      Sau
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 18l6-6-6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default CourseSearchPage;
