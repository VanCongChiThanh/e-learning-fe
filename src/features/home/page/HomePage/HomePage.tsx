import { Link, createSearchParams } from "react-router-dom";
import MainLayout from "../../../../layouts/MainLayout";
import "./HomePage.scss";
import HomeLayout from "../../layout/HomeLayout";
import { useEffect, useState } from "react";
import { searchCourses } from "../../api";

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
  averageRating: number;
  totalReviews: number;
  totalLectures: number;
  totalStudents: number;
  createdAt: string;
}

interface Career {
  id: string;
  title: string;
  description: string;
  image: string;
  bgColor: string;
}

interface CertificationCourse {
  id: string;
  provider: string;
  providerLogo: string;
  title: string;
  rating: number;
  reviews: string;
  type: string;
  image: string;
}

const HomePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample career data
  const careers: Career[] = [
    {
      id: "1",
      title: "Data Analyst",
      description:
        "A Data Analyst collects, cleans, and interprets data, using tools like Excel, SQL, and Python.",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)",
    },
    {
      id: "2",
      title: "Data Scientist",
      description:
        "A Data Scientist analyzes large datasets to uncover insights, using statistics, machine learning, and programming.",
      image:
        "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/00atxywtfxvd/6gKoZ1AVu36CMpmu3N3BZw/51e59b6ed5e46b50bfb98c738b3b2329/data-analyst-hero_2x.png?auto=format%2Ccompress&dpr=1&w=720",
      bgColor: "linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)",
    },
    {
      id: "3",
      title: "Machine Learning Engineer",
      description:
        "A Machine Learning Engineer builds and optimizes algorithms that enable systems to learn from data.",
      image:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=300&fit=crop",
      bgColor: "linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)",
    },
    {
      id: "4",
      title: "Cyber Security Analyst",
      description:
        "A Cyber Security Analyst monitors IT systems, analyzes threats, and implements security measures.",
      image:
        "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/00atxywtfxvd/69cNAmQMmrlgOZiqDhQ2cP/b53c174c81e14d7a4c1a5d307db9a128/Machine_Learning_Engineer-hero_2x.png?auto=format%2Ccompress&dpr=1&w=720",
      bgColor: "linear-gradient(135deg, #42A5F5 0%, #64B5F6 100%)",
    },
  ];

  // Sample certification courses (Coursera-style)
  const certificationCourses: CertificationCourse[] = [
    {
      id: "1",
      provider: "Google",
      providerLogo:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/150px-Google_2015_logo.svg.png",
      title: "Phân Tích Dữ Liệu với Python",
      rating: 5.0,
      reviews: "6 đánh giá",
      type: "Chuyên môn",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      provider: "Meta",
      providerLogo:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/150px-Meta_Platforms_Inc._logo.svg.png",
      title: "Lập Trình Viên Full-Stack",
      rating: 4.7,
      reviews: "24K đánh giá",
      type: "Chuyên môn",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    },
    {
      id: "3",
      provider: "Google",
      providerLogo:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/150px-Google_2015_logo.svg.png",
      title: "Quản Lý Quan Hệ Cổ Đông",
      rating: 4.8,
      reviews: "8 đánh giá",
      type: "Chuyên môn",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    },
  ];

  // --- ENUM category ---
  enum Category {
    ALL = "ALL",
    PROGRAMMING = "PROGRAMMING",
    DESIGN = "DESIGN",
    PROJECT_MANAGEMENT = "PROJECT_MANAGEMENT",
    DATA_SCIENCE = "DATA_SCIENCE",
    LANGUAGE_LEARNING = "LANGUAGE_LEARNING",
    DEVELOPMENT = "DEVELOPMENT",
    WEB_DEVELOPMENT = "WEB_DEVELOPMENT",
    MOBILE_DEVELOPMENT = "MOBILE_DEVELOPMENT",
    AI_AND_MACHINE_LEARNING = "AI_AND_MACHINE_LEARNING",
    CYBERSECURITY = "CYBERSECURITY",
    CLOUD_COMPUTING = "CLOUD_COMPUTING",
    DEVOPS = "DEVOPS",
    GAME_DEVELOPMENT = "GAME_DEVELOPMENT",
    SOFTWARE_ENGINEERING = "SOFTWARE_ENGINEERING",
    DATABASES = "DATABASES",
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const safeRating = (r?: number) => {
    const v = Number.isFinite(r) ? (r as number) : 5;
    return { num: v.toFixed(1), int: Math.floor(v) };
  };

  const buildSearch = (code: Category) =>
    createSearchParams({
      filter: code === Category.ALL ? "" : `category = '${code}'`,
      category: code,
    }).toString();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await searchCourses({
        page: 1,
        paging: 4,
        sort: "created_at",
        order: "desc",
      });
      if (res.status === "success") setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderCourseCard = (course: Course) => {
    const rating = safeRating(course.averageRating);
    return (
      <Link
        key={course.courseId}
        to={`/course/${course.slug}`}
        className="course-card"
        aria-label={course.title}
      >
        <div className="course-image">
          <img
            src={
              course.image || "https://via.placeholder.com/400x225?text=Course"
            }
            alt={course.title}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/400x225?text=Course";
            }}
          />
          {course.level && <span className="course-level">{course.level}</span>}
        </div>

        <div className="course-info">
          <h3 className="course-title" title={course.title}>
            {course.title}
          </h3>

          <div className="course-rating">
            <span className="rating-number">{rating.num}</span>
            <div className="stars" aria-hidden>
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fa-solid fa-star ${
                    i < rating.int ? "filled" : ""
                  }`}
                />
              ))}
            </div>
            <span className="students-count">({course.totalReviews || 0})</span>
          </div>

          <div className="course-price">
            {course.price === 0 ? (
              <span className="current-price free">Miễn phí</span>
            ) : (
              <span className="current-price">{formatPrice(course.price)}</span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  // --- Category list hiển thị ---
  const categories = [
    { code: Category.PROGRAMMING, name: "Programming", icon: "👨‍💻" },
    { code: Category.DESIGN, name: "Design", icon: "🎨" },
    {
      code: Category.PROJECT_MANAGEMENT,
      name: "Project Management",
      icon: "💼",
    },
    { code: Category.DATA_SCIENCE, name: "Data Science", icon: "📊" },
    { code: Category.LANGUAGE_LEARNING, name: "Language Learning", icon: "🌐" },
    { code: Category.DEVELOPMENT, name: "Development", icon: "🧱" },
    { code: Category.WEB_DEVELOPMENT, name: "Web Development", icon: "🌍" },
    {
      code: Category.MOBILE_DEVELOPMENT,
      name: "Mobile Development",
      icon: "📱",
    },
    { code: Category.AI_AND_MACHINE_LEARNING, name: "AI & ML", icon: "🤖" },
    { code: Category.CYBERSECURITY, name: "Cybersecurity", icon: "🛡️" },
    { code: Category.CLOUD_COMPUTING, name: "Cloud Computing", icon: "☁️" },
    { code: Category.DEVOPS, name: "DevOps", icon: "⚙️" },
    { code: Category.GAME_DEVELOPMENT, name: "Game Development", icon: "🎮" },
    {
      code: Category.SOFTWARE_ENGINEERING,
      name: "Software Engineering",
      icon: "🧩",
    },
    { code: Category.DATABASES, name: "Databases", icon: "🗄️" },
  ];

  if (loading)
    return (
      <MainLayout>
        <HomeLayout>
          <div className="home-page">
            <div className="loading-container">
              <div className="spinner" />
              <p>Đang tải khóa học...</p>
            </div>
          </div>
        </HomeLayout>
      </MainLayout>
    );

  return (
    <MainLayout>
      <HomeLayout>
        <div className="home-page">
          {/* --- Explore Categories --- */}
          <section className="explore-categories container">
            <h2>Khám phá danh mục</h2>
            <div className="categories-grid">
              {categories.map((cat) => (
                <Link
                  key={cat.code}
                  to={{
                    pathname: "/courses/search",
                    search: buildSearch(cat.code),
                  }}
                  className="category-item"
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
          {/* Hot New Releases */}{" "}
          {courses.length > 0 && (
            <section className="hot-releases container">
              {" "}
              {/* Title for small screens */}{" "}
              <div className="promo-slab">
                {" "}
                <div className="section-header-mobile">
                  {" "}
                  <h2>Khoá học mới ra mắt</h2>{" "}
                  <Link to="/courses/search" className="arrow-link">
                    {" "}
                    →{" "}
                  </Link>{" "}
                </div>{" "}
                <div className="promo-left">
                  {" "}
                  <h3>Khóa học mới ra mắt</h3>{" "}
                  <Link to="/courses/search" className="btn-outline">
                    {" "}
                    Xem ngay <span className="arrow">›</span>{" "}
                  </Link>{" "}
                </div>{" "}
                <div className="cards-grid">
                  {" "}
                  {courses.map((c) => renderCourseCard(c))}
                </div>
              </div>
            </section>
          )}
          {/* Explore Careers */}
          <section className="explore-careers container">
            <div className="section-header">
              <h2>Cơ hội nghề nghiệp</h2>
              <Link to="/courses/search" className="explore-all-link">
                Khám phá tất cả →
              </Link>
            </div>

            <div className="careers-grid">
              {careers.map((career) => (
                <Link
                  key={career.id}
                  to={`/courses/search?category=${career.title}`}
                  className="career-card"
                >
                  <div
                    className="career-image"
                    style={{ background: career.bgColor }}
                  >
                    <img src={career.image} alt={career.title} loading="lazy" />
                  </div>
                  <div className="career-content">
                    <h3 className="career-title">{career.title}</h3>
                    <p className="career-description">{career.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          {/* What brings you section */}
          <section className="what-brings-you container">
            <h2>Điều gì đưa bạn đến đây hôm nay?</h2>
            <div className="brings-options">
              <Link to="/courses/search" className="brings-option">
                <div className="option-icon">🚀</div>
                <span>Bắt đầu sự nghiệp</span>
              </Link>
              <Link to="/courses/search" className="brings-option">
                <div className="option-icon">🔄</div>
                <span>Chuyển đổi nghề nghiệp</span>
              </Link>
              <Link to="/courses/search" className="brings-option">
                <div className="option-icon">📈</div>
                <span>Phát triển vai trò hiện tại</span>
              </Link>
              <Link to="/courses/search" className="brings-option">
                <div className="option-icon">🎯</div>
                <span>Khám phá chủ đề ngoài công việc</span>
              </Link>
            </div>
          </section>
          {/* Industry Certifications */}
          <section className="industry-certs">
            <div className="container">
              <div className="certs-grid">
                <div className="cert-promo">
                  <h3>Chuẩn bị cho kỳ thi chứng chỉ ngành</h3>
                  <Link to="/courses/search" className="explore-courses-btn">
                    Khám phá khóa học →
                  </Link>
                </div>

                <div className="cert-cards">
                  {certificationCourses.map((cert) => (
                    <Link
                      key={cert.id}
                      to={`/courses/search?provider=${cert.provider}`}
                      className="cert-card"
                    >
                      <div className="cert-image">
                        <img src={cert.image} alt={cert.title} loading="lazy" />
                        <div className="cert-provider-badge">
                          <img src={cert.providerLogo} alt={cert.provider} />
                        </div>
                      </div>
                      <div className="cert-info">
                        <p className="cert-provider">{cert.provider}</p>
                        <h4 className="cert-title">{cert.title}</h4>
                        <div className="cert-rating">
                          <span className="rating-num">{cert.rating}</span>
                          <span className="stars">★</span>
                          <span className="reviews">{cert.reviews}</span>
                        </div>
                        <p className="cert-type">{cert.type}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </HomeLayout>
    </MainLayout>
  );
};
export default HomePage;
