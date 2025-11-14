import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../../../../layouts/MainLayout";
import { searchCourses } from "../../api";
import "./LandingPage.scss";

interface Course {
  courseId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  level: string;
  averageRating: number;
  totalReviews: number;
  instructorName?: string;
}

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  quote: string;
  image: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [trendingCourses, setTrendingCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Đinh Bảo Châu Thi",
      position: "Giám đốc Phân tích Dữ liệu",
      company: "VNG Corporation",
      quote:
        "Tôi tin rằng Coursevo đã có tác động đáng kể đến sự thăng tiến của tôi. Tôi có mọi thứ cần thiết để phát triển sự nghiệp của mình trên một nền tảng - nó gần như rất quan trọng đối với thành công của tôi.",
      image:
        "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/00atxywtfxvd/6P9DiTmdmcer8Zf7aHk2HJ/99a90ec6e9a6274d07c3f5da3b10e687/474x328-C_.png?auto=format%2Ccompress&dpr=2&w=600&h=416",
    },
    {
      id: 2,
      name: "Ngô Đình Lộc",
      position: "Senior Frontend Developer",
      company: "FPT Software",
      quote:
        "Các khóa học trên Coursevo đã giúp tôi nâng cao kỹ năng lập trình và chuyển đổi sự nghiệp thành công. Nội dung thực tế và dễ hiểu, giảng viên nhiệt tình. Đây là nền tảng học tập tuyệt vời!",
      image:
        "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/00atxywtfxvd/5rYF1dB5rQdD8Ude60Vcgk/a64d122febc9a54ee56402dd3d012042/Data_Scientist-hero_2x.png?auto=format%2Ccompress&dpr=2&w=720",
    },
    {
      id: 3,
      name: "Hồ Thị Thu Thanh",
      position: "UI/UX Designer",
      company: "Tiki",
      quote:
        "Coursevo cung cấp những khóa học thiết kế chất lượng cao với giá cả phải chăng. Tôi đã học được rất nhiều kỹ thuật mới và áp dụng ngay vào công việc. Cảm ơn Coursevo đã đồng hành cùng tôi!",
      image: "https://designerup.co/blog/content/images/2021/10/3-2.png",
    },
    {
      id: 4,
      name: "Văn Công Chí Thanh",
      position: "Product Manager",
      company: "Shopee Vietnam",
      quote:
        "Nền tảng học tập linh hoạt, có thể học mọi lúc mọi nơi. Các khóa học về quản lý sản phẩm rất chi tiết và thực tế. Coursevo đã giúp tôi tự tin hơn trong công việc và thăng tiến nhanh chóng.",
      image:
        "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/00atxywtfxvd/6gKoZ1AVu36CMpmu3N3BZw/51e59b6ed5e46b50bfb98c738b3b2329/data-analyst-hero_2x.png?auto=format%2Ccompress&dpr=2&w=720",
    },
  ];

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        const response = await searchCourses({
          page: 1,
          paging: 4,
          sort: "created_at",
          order: "desc",
        });
        setTrendingCourses(response.data || []);
      } catch (error) {
        console.error("Error fetching trending courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCourses();
  }, []);

  const categories = [
    { key: "PROGRAMMING", label: "Lập trình" },
    { key: "DESIGN", label: "Thiết kế" },
    { key: "PROJECT_MANAGEMENT", label: "Quản lý dự án" },
    { key: "DATA_SCIENCE", label: "Khoa học dữ liệu" },
    { key: "WEB_DEVELOPMENT", label: "Phát triển Web" },
    { key: "MOBILE_DEVELOPMENT", label: "Phát triển Mobile" },
    { key: "AI_AND_MACHINE_LEARNING", label: "AI & Machine Learning" },
    { key: "CYBERSECURITY", label: "An ninh mạng" },
    { key: "CLOUD_COMPUTING", label: "Điện toán đám mây" },
    { key: "DEVOPS", label: "DevOps" },
    { key: "GAME_DEVELOPMENT", label: "Phát triển Game" },
    { key: "SOFTWARE_ENGINEERING", label: "Kỹ thuật phần mềm" },
    { key: "DATABASES", label: "Cơ sở dữ liệu" },
    { key: "LANGUAGE_LEARNING", label: "Học ngoại ngữ" },
  ];

  const handleCategoryClick = (categoryKey: string) => {
    navigate(`/courses/search?category=${categoryKey}`);
  };

  return (
    <MainLayout>
      <section className="landing-hero">
        <div className="landing-container">
          <div className="hero-text">
            <h1>
              Phát triển kỹ năng để{" "}
              <span className="highlight">thăng tiến trong sự nghiệp</span>
            </h1>
            <p>
              Nhận định hướng và lộ trình học tập để trau dồi những{" "}
              <strong>kỹ năng thiết yếu</strong> giúp bạn{" "}
              <strong>tiến xa hơn trong sự nghiệp</strong> — từ nền tảng học tập
              hot nhất hiện ngay.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Bắt đầu dùng thử miễn phí
              </Link>
              <Link to="/purchase" className="btn btn-outline">
                Dành cho doanh nghiệp
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://static.licdn.com/aero-v1/sc/h/5mbe7amt67glb1wbym1pss6dq"
              alt="Người học đang ghi chép bên laptop"
            />
          </div>
        </div>
      </section>

      {/* Personalized Learning Section */}
      <section className="personalized-learning-section">
        <div className="learning-container">
          {/* Item 1 - Skill Evaluation */}
          <div className="learning-item">
            <div className="learning-image">
              <img
                src="https://static.licdn.com/aero-v1/sc/h/3ebu2cjxuw8s3oh7l6kftwbgu"
                alt="Đánh giá kỹ năng"
              />
            </div>
            <div className="learning-content">
              <h2>Cá nhân hóa việc học của bạn</h2>
              Đặt mục tiêu nghề nghiệp và dùng <strong>
                Đánh giá Kỹ năng
              </strong>{" "}
              để xác định năng lực hiện tại, từ đó kết nối nhanh với các khoá
              học phù hợp với vị trí bạn đang đứng trên hành trình sự nghiệp.
            </div>
          </div>

          {/* Item 2 - Role Guides */}
          <div className="learning-item reverse">
            <div className="learning-image">
              <img
                src="https://static.licdn.com/aero-v1/sc/h/3ebu2cjxuw8s3oh7l6kftwbgu"
                alt="Hướng dẫn vai trò"
              />
            </div>
            <div className="learning-content">
              <h2>Học theo lộ trình, bám sát vai trò</h2>
              <p>
                Khám phá <strong>Hướng dẫn theo Vai trò</strong> với hơn{" "}
                <strong>35</strong> vai trò và <strong>1.300+</strong> lộ trình
                đã được tuyển chọn, giúp bạn học có định hướng, xây nền vững
                chắc và nâng cao các kỹ năng chuyên sâu để thăng tiến.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Stats Section */}
      <section className="global-stats-section">
        <div className="stats-container">
          <h2 className="stats-title">
            Phát triển kỹ năng toàn cầu cho vai trò hiện tại và vai trò tiếp
            theo của bạn
          </h2>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">24,900</div>
              <div className="stat-label">khóa học</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">3,900+</div>
              <div className="stat-label">
                chuyên gia ngành và các nhà lãnh đạo tư tưởng
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-number">20+</div>
              <div className="stat-label">ngôn ngữ phụ đề</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">7</div>
              <div className="stat-label">thư viện ngôn ngữ gốc</div>
            </div>
          </div>
        </div>
      </section>
      {/* Trending Courses Section */}
      <section className="trending-courses-section">
        <div className="trending-container">
          <div className="trending-header">
            <h2 className="trending-title">Khóa học xu hướng</h2>
            <p className="trending-subtitle">
              Khám phá các khóa học mới nhất được thêm vào nền tảng
            </p>
          </div>

          {loading ? (
            <div className="courses-loading">
              <div className="spinner"></div>
              <p>Đang tải khóa học...</p>
            </div>
          ) : (
            <div className="courses-grid">
              {trendingCourses.map((course) => (
                <Link
                  key={course.courseId}
                  to={`/courses/${course.slug}`}
                  className="course-card"
                >
                  <div className="course-image">
                    <img
                      src={
                        course.image || "https://placehold.co/400x225?text=Course"
                      }
                      alt={course.title}
                    />
                    <span className="course-level">{course.level}</span>
                  </div>
                  <div className="course-info">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">
                      {course.description?.substring(0, 100)}
                      {course.description?.length > 100 ? "..." : ""}
                    </p>
                    <div className="course-meta">
                      <div className="course-rating">
                        <span className="rating-star">★</span>
                        <span className="rating-value">
                          {course.averageRating?.toFixed(1) || "N/A"}
                        </span>
                        <span className="rating-count">
                          ({course.totalReviews || 0})
                        </span>
                      </div>
                      <div className="course-price">
                        {course.price === 0 ? (
                          <span className="price-free">Miễn phí</span>
                        ) : (
                          <span className="price-value">
                            {course.price.toLocaleString("vi-VN")} ₫
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="trending-footer">
            <button
              className="btn-view-all"
              onClick={() => navigate("/courses/search")}
            >
              Xem tất cả khóa học
            </button>
          </div>
        </div>
      </section>
      {/* Course Categories Section */}
      <section className="course-categories-section">
        <div className="categories-container">
          <div className="categories-content">
            <h2 className="categories-title">Tìm khóa học phù hợp với bạn</h2>
            <p className="categories-subtitle">
              Chọn từ hơn <strong>24,900 khóa học</strong> và{" "}
              <strong>Lộ trình học tập</strong>, hàng chục khóa được thêm mỗi
              tuần.
            </p>
          </div>

          <div className="categories-tags">
            {categories.map((category) => (
              <button
                key={category.key}
                className="category-tag"
                onClick={() => handleCategoryClick(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="categories-image">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
            alt="Người đang học trực tuyến"
          />
        </div>
      </section>

      {/* Practice & Learning Formats Section */}
      <section className="practice-formats-section">
        <div className="practice-formats-container">
          {/* Hands-on Practice */}
          <div className="practice-item">
            <div className="practice-content">
              <h2 className="practice-title">Thực hành thực tế</h2>
              <p className="practice-description">
                Thực hành code ngay trực tiếp ứng với nội dung đang học với trợ
                lý ảo CoursevoAI giúp bạn nhận được phản hồi tức thì và cải
                thiện kỹ năng lập trình.
              </p>
            </div>
            <div className="practice-mockup">
              <img
                src="https://static.licdn.com/aero-v1/sc/h/cgh3vn0u4ex7bcawnwvzs8xiz"
                alt="Thực hành code với GitHub Codespaces"
              />
            </div>
          </div>

          {/* Learning Formats */}
          <div className="formats-item">
            <div className="formats-mockup">
              <img
                src="https://static.licdn.com/aero-v1/sc/h/at6b0jpq5a7eskqmo7iolih6h"
                alt="Định dạng học tập đa dạng"
              />
            </div>
            <div className="formats-content">
              <h2 className="formats-title">Lộ trình học tập dễ hiểu</h2>
              <p className="formats-description">
                <strong>450+ video Nano Tips</strong> để học nhanh, có thể hành
                động ngay ngoài các video dài, âm thanh và định dạng học tập dựa
                trên văn bản.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials & Certifications Section */}
      <section className="credentials-section">
        <div className="credentials-container">
          <div className="credentials-content">
            <h2 className="credentials-title">Chứng chỉ & Chứng nhận</h2>
            <p className="credentials-description">
              Chứng chỉ chuyên nghiệp từ các nhà cung cấp đáng tin cậy như{" "}
              <strong>Microsoft, Zendesk, LambdaTest</strong> và{" "}
              <strong>BluePrism</strong> giúp bạn có thể chuẩn bị, đánh giá và
              thể hiện kỹ năng trên cùng một nền tảng.
            </p>
          </div>

          <div className="credentials-mockup">
            <img
              src="https://static.licdn.com/aero-v1/sc/h/9ziftfdshp7l1scjh6uwxyajs"
              alt="Chứng chỉ và xác thực"
            />
          </div>
        </div>

        <div className="credentials-footer">
          <div className="credentials-illustration">
            <img
              src="https://static.licdn.com/aero-v1/sc/h/9dyey8vt3pfeieh3n98g3s29s"
              alt="Người học đang làm việc"
            />
          </div>

          <p className="credentials-stats">
            Hơn <strong>2,000 khóa học</strong> để chuẩn bị cho hơn{" "}
            <strong>120 chứng chỉ</strong> nền tảng bao gồm chứng chỉ, đơn vị
            giáo dục và <strong>tín chỉ học thuật</strong>.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="testimonials-title">
            Câu chuyện thành công từ học viên
          </h2>

          <div className="testimonials-slider">
            <button
              className="testimonial-nav prev"
              onClick={handlePrevTestimonial}
              aria-label="Trước đó"
            >
              ←
            </button>

            <div className="testimonial-card">
              <div className="testimonial-image">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                />
              </div>
              <div className="testimonial-content">
                <p className="testimonial-quote">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <div className="testimonial-author">
                  <h4>{testimonials[currentTestimonial].name}</h4>
                  <p>
                    {testimonials[currentTestimonial].position},{" "}
                    {testimonials[currentTestimonial].company}
                  </p>
                </div>
              </div>
            </div>

            <button
              className="testimonial-nav next"
              onClick={handleNextTestimonial}
              aria-label="Tiếp theo"
            >
              →
            </button>
          </div>

          <div className="testimonial-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentTestimonial ? "active" : ""
                }`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`Đến feedback ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Companies Section */}
      <section className="trusted-companies-section">
        <div className="trusted-companies-container">
          <h2 className="trusted-companies-title">
            Được tin tưởng bởi các tổ chức hàng đầu
          </h2>
          <p className="trusted-companies-subtitle">
            Hàng nghìn công ty trên toàn thế giới sử dụng Coursevo để phát triển
            đội ngũ nhân viên của họ
          </p>

          <div className="companies-logos">
            <div className="logo-item">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/300px-HP_logo_2012.svg.png"
                alt="HP"
              />
            </div>
            <div className="logo-item">
              <img
                src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTkyMDMwNCwicHVyIjoiYmxvYl9pZCJ9fQ==--a815874c61263c424195c8235bbf56837b0f14b5/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJqcGciLCJyZXNpemVfdG9fZml0IjpbMTcwLG51bGxdfSwicHVyIjoidmFyaWF0aW9uIn19--153c6060efaf53113351c55943967c335f67bf0f/LogoVNPT%20-%20Lam%20Tran.jpg"
                alt="VNPT IT"
              />
            </div>
            <div className="logo-item">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFTFQkpJ0xal1_ri6Q7fvWCw9nN3E1AV2jMw&s"
                alt="Allianz"
              />
            </div>
            <div className="logo-item">
              <img
                src="https://images.ctfassets.net/hzfwsdcegxo2/1JdERRi8drfhhp0QAaagT4/dc07aedcaa11ee55b051ec10864dcbb3/Zillow_Wordmark_Blue_RGB.jpeg?w=1200&h=630&fit=fill"
                alt="Zillow Group"
              />
            </div>
            <div className="logo-item">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/300px-LEGO_logo.svg.png"
                alt="LEGO"
              />
            </div>
            <div className="logo-item">
              <img
                src="https://yt3.googleusercontent.com/ytc/AIdro_nvTCmpSRWmyRrGHJkgIj2Io8fk-bpH2IvhIEzI8q6PnA=s900-c-k-c0x00ffffff-no-rj"
                alt="Standard Bank"
              />
            </div>
          </div>

          <div className="trusted-companies-cta">
            <p>Khám phá giải pháp doanh nghiệp của chúng tôi</p>
            <button className="cta-button">
              Tìm hiểu thêm về Coursevo Business
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;
