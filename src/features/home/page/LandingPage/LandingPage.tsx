import "./LandingPage.scss";
import MainLayout from "../../../../layouts/MainLayout";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
gsap.registerPlugin(ScrollTrigger);

const TYPING_WORDS = [
  { text: "skills", color: "#3b82f6" }, // blue
  { text: "career", color: "#10b981" }, // green
  { text: "team", color: "#f59e0b" }, // orange
  { text: "self", color: "#8b5cf6" }, // purple
  { text: "potential", color: "#ec4899" }, // pink
];

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing animation effect
  useEffect(() => {
    const currentWord = TYPING_WORDS[typingIndex];
    const typingSpeed = isDeleting ? 50 : 150;
    const pauseTime = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (typingText.length < currentWord.text.length) {
          setTypingText(currentWord.text.slice(0, typingText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting
        if (typingText.length > 0) {
          setTypingText(currentWord.text.slice(0, typingText.length - 1));
        } else {
          setIsDeleting(false);
          setTypingIndex((prev) => (prev + 1) % TYPING_WORDS.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typingText, isDeleting, typingIndex]);

  useEffect(() => {
    const benefitsSection = document.querySelector(
      ".benefits-section"
    ) as HTMLElement | null;
    const benefitsWrapper = document.querySelector(
      ".benefits-wrapper"
    ) as HTMLElement | null;
    const items = gsap.utils.toArray<HTMLElement>(".benefit-item");

    if (!benefitsSection || !benefitsWrapper || items.length === 0) return;

    // Tính khoảng cách cần scroll để item cuối hiển thị đầy đủ
    const viewportWidth = window.innerWidth;

    // Khoảng cách scroll = tổng width của wrapper - viewport width
    const scrollDistance = Math.max(
      0,
      benefitsWrapper.scrollWidth - viewportWidth
    );

    gsap.to(benefitsWrapper, {
      x: () => -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: benefitsSection,
        pin: true,
        scrub: 1,
        end: `+=${scrollDistance}`,
        onUpdate: () => {
          // Tính active slide dựa trên vị trí thực tế của các items
          const viewportCenter = viewportWidth / 2;

          // Tìm item nào đang ở gần trung tâm màn hình nhất
          let closestIndex = 0;
          let closestDistance = Infinity;

          items.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const distance = Math.abs(itemCenter - viewportCenter);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });

          setActiveSlide(closestIndex);
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  return (
    <MainLayout>
      <div className="landing-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-left">
              <div className="play-button-wrapper">
                <div className="circle-animation circle-1"></div>
                <div className="circle-animation circle-2"></div>
                <div className="circle-animation circle-3"></div>
                <button
                  className="play-button"
                  aria-label="Xem video giới thiệu"
                >
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <circle
                      cx="30"
                      cy="30"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path d="M24 18L42 30L24 42V18Z" fill="currentColor" />
                  </svg>
                </button>
                <div className="circle-text">
                  <svg viewBox="0 0 200 200">
                    <path
                      id="circlePath"
                      d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                      fill="none"
                    />
                    <text>
                      <textPath href="#circlePath" startOffset="0%">
                        CHỌN LỘ TRÌNH • CỦA BẠN • CHỌN LỘ TRÌNH • CỦA BẠN •
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="hero-right">
              <h1 className="hero-title">
                <span className="title-line">Develop your</span>
                <span className="title-line typing-line">
                  <span className="slash">/</span>
                  <span className={`typing-text typing-color-${typingIndex}`}>
                    {typingText}
                  </span>
                  <span className="typing-cursor">|</span>
                </span>
              </h1>

              <p className="hero-subtitle">
                Phát triển sự nghiệp của bạn và mở ra những cơ hội mới bằng cách
                học các kỹ năng đang được săn đón như Trí tuệ nhân tạo, Phân
                tích dữ liệu, Lập trình, An ninh mạng và nhiều lĩnh vực khác.
              </p>

              <div className="hero-buttons">
                <Link to="/courses/search" className="btn-primary">
                  Xem khoá học
                </Link>
                <button className="btn-outline">TƯ VẤN & ĐĂNG KÝ</button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories Section */}
        <section className="featured-categories">
          <div className="categories-header">
            <h2>Khám phá lộ trình học IT</h2>
            <p>
              Chọn lĩnh vực phù hợp với đam mê và mục tiêu nghề nghiệp của bạn
            </p>
          </div>
          <div className="categories-grid">
            <Link
              to="/courses/search?category=PROGRAMMING"
              className="category-card"
            >
              <div className="category-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 6L4 10L8 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 6L20 10L16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 4L10 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Lập trình</h3>
              <p>Java, Python, JavaScript, C++</p>
              <span className="course-count">120+ khóa học</span>
            </Link>

            <Link
              to="/courses/search?category=DEVELOPMENT"
              className="category-card"
            >
              <div className="category-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 3V21" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h3>Web Development</h3>
              <p>React, Angular, Node.js, PHP</p>
              <span className="course-count">95+ khóa học</span>
            </Link>

            <Link
              to="/courses/search?category=DATA_SCIENCE"
              className="category-card"
            >
              <div className="category-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Data Science & AI</h3>
              <p>Machine Learning, Deep Learning</p>
              <span className="course-count">68+ khóa học</span>
            </Link>

            <Link
              to="/courses/search?category=DESIGN"
              className="category-card"
            >
              <div className="category-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="14"
                    y="3"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="3"
                    y="14"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>UI/UX Design</h3>
              <p>Figma, Adobe XD, Design System</p>
              <span className="course-count">45+ khóa học</span>
            </Link>
          </div>
        </section>
        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="section-title">
            <h2 className="benefits-main-title">
              6 Điểm Khác Biệt Tại Coursevo Giúp Bạn Thăng Tiến Trong Sự Nghiệp
            </h2>
            <div className="benefits-progress">
              <div
                className={`progress-line ${activeSlide === 0 ? "active" : ""}`}
              ></div>
              <div
                className={`progress-line ${activeSlide === 1 ? "active" : ""}`}
              ></div>
              <div
                className={`progress-line ${activeSlide === 2 ? "active" : ""}`}
              ></div>
              <div
                className={`progress-line ${activeSlide === 3 ? "active" : ""}`}
              ></div>
              <div
                className={`progress-line ${activeSlide === 4 ? "active" : ""}`}
              ></div>
              <div
                className={`progress-line ${activeSlide === 5 ? "active" : ""}`}
              ></div>
            </div>
          </div>
          <div className="benefits-wrapper">
            <div className="benefit-item">
              <div className="benefit-content">
                <h3 className="benefit-title">
                  1.Kết nối với giảng viên chất lượng
                </h3>
                <ul className="benefit-list">
                  <li>
                    Giảng viên từ công ty công nghệ hàng đầu, 5-10 năm kinh
                    nghiệm
                  </li>
                  <li>Hỗ trợ tận tình, review code trực tiếp từ chuyên gia</li>
                </ul>
              </div>
              <div className="benefit-image">
                <img
                  src="/svg/undraw_problem-solving_1kpx.svg"
                  alt="Project Learning"
                />
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-content">
                <h3 className="benefit-title">2.Thực hành với AI Feedback</h3>
                <ul className="benefit-list">
                  <li>Thực hành code trực tiếp trên nền tảng học tập</li>
                  <li>
                    AI phân tích và feedback code tức thì, phát hiện lỗi và gợi
                    ý tối ưu 24/7
                  </li>
                </ul>
              </div>
              <div className="benefit-image">
                <img
                  src="https://cyberlearn.vn/wp-content/uploads/2020/04/cyberlearn-support.gif"
                  alt="Learning Path"
                />
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-content">
                <h3 className="benefit-title">3.Học qua dự án thực tế</h3>
                <ul className="benefit-list">
                  <li>
                    Lộ trình bài bản từ cơ bản đến nâng cao, sát với yêu cầu
                    doanh nghiệp
                  </li>
                  <li>Xây dựng portfolio dự án để tăng cơ hội xin việc</li>
                </ul>
              </div>
              <div className="benefit-image">
                <img
                  src="https://cyberlearn.vn/wp-content/uploads/2020/04/0e8358a4-guidedlearningpath.gif"
                  alt="Mentorship"
                />
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-content">
                <h3 className="benefit-title">4.Cộng đồng năng động</h3>
                <ul className="benefit-list">
                  <li>
                    Cộng đồng học viên tích cực hỗ trợ lẫn nhau, giảng viên phản
                    hồi nhanh
                  </li>
                  <li>Networking với chuyên gia và học viên trong ngành</li>
                </ul>
              </div>
              <div className="benefit-image">
                <img src="/svg/connect-instructor.svg" alt="Mentorship" />
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-content">
                <h3 className="benefit-title">
                  5. Học trực tuyến linh hoạt với công nghệ hiện đại
                </h3>
                <ul className="benefit-list">
                  <li>Học mọi lúc mọi nơi trên mọi thiết bị</li>
                  <li>Xem lại bài giảng không giới hạn</li>
                  <li>Hệ thống đồng bộ tiến độ tự động</li>
                </ul>
              </div>
              <div className="benefit-image">
                <img
                  src="https://cyberlearn.vn/wp-content/uploads/2021/02/coding__img.gif"
                  alt="Online Learning"
                />
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-content">
                <h3 className="benefit-title">6. Chứng nhận và Việc làm</h3>
                <ul className="benefit-list">
                  <li>Cấp chứng nhận trực tuyến sau khi hoàn thành</li>
                  <li>Tạo CV trực tuyến độc đáo</li>
                  <li>Kết nối với các đối tác tuyển dụng</li>
                </ul>
              </div>
              <div className="benefit-image">
                <img
                  src="https://cyberlearn.vn/wp-content/uploads/2021/02/certificate__img-1.gif"
                  alt="Certification"
                />
              </div>
            </div>
          </div>
        </section>
        {/* About Section */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-content">
              <h2 className="section-title">
                Chọn đúng lộ trình cho bạn và Thăng tiến sự nghiệp cùng Coursevo
              </h2>
              <p className="section-description">
                Học Thật, Dự Án Thật, Việc Làm Thật, Học Mọi Lúc, Mọi Nơi
              </p>
              <div className="about-buttons">
                <button className="btn-primary">ĐĂNG KÝ HỌC THỬ</button>
                <button className="btn-secondary">INBOX TƯ VẤN 1-1</button>
              </div>
            </div>
          </div>
        </section>
        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-tabs">
            <button
              className={`mission-tab ${activeTab === 0 ? "active" : ""}`}
              onClick={() => setActiveTab(0)}
            >
              Coursevo là gì?
            </button>
            <button
              className={`mission-tab ${activeTab === 1 ? "active" : ""}`}
              onClick={() => setActiveTab(1)}
            >
              Giảng viên
            </button>
            <button
              className={`mission-tab ${activeTab === 2 ? "active" : ""}`}
              onClick={() => setActiveTab(2)}
            >
              Học viên
            </button>
          </div>

          {/* Tab 1: Coursevo là gì? */}
          {activeTab === 0 && (
            <div className="mission-container">
              <div className="mission-left">
                <h2 className="section-title">
                  Nền tảng kết nối giảng viên IT chuyên nghiệp
                </h2>
                <p className="mission-text">
                  <strong>Coursevo</strong> là nền tảng học trực tuyến tập trung
                  vào lĩnh vực
                  <strong> Công nghệ thông tin</strong>, kết nối học viên với
                  các giảng viên chuyên gia đang làm việc tại các công ty công
                  nghệ hàng đầu.
                </p>
                <p className="mission-text">
                  Khác với các nền tảng truyền thống, chúng tôi chỉ tuyển chọn
                  những giảng viên có kinh nghiệm thực tế trong ngành IT - từ
                  lập trình viên senior, tech lead, đến solution architect. Họ
                  không chỉ dạy lý thuyết mà còn chia sẻ kinh nghiệm thực chiến
                  từ các dự án thực tế.Kết hợp với đó là thế mạnh của hệ thống
                  vừa học và thực hành với trợ giảng AI cho phản hồi code tức
                  thì 24/7, giúp học viên nắm vững kiến thức và kỹ năng cần
                  thiết để phát triển sự nghiệp trong ngành IT.
                </p>
                <div className="mission-stats">
                  <div className="stat-item">
                    <h3>500+</h3>
                    <p>Giảng viên IT</p>
                  </div>
                  <div className="stat-item">
                    <h3>10,000+</h3>
                    <p>Học viên</p>
                  </div>
                  <div className="stat-item">
                    <h3>200+</h3>
                    <p>Khóa học</p>
                  </div>
                </div>
              </div>
              <div className="mission-right">
                <div className="video-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                    alt="Online learning platform"
                  />
                  <button
                    className="play-button-overlay"
                    aria-label="Play video"
                  >
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                      <circle
                        cx="40"
                        cy="40"
                        r="38"
                        fill="rgba(255,255,255,0.9)"
                      />
                      <path d="M32 24L56 40L32 56V24Z" fill="#1a5f3f" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Giảng viên */}
          {activeTab === 1 && (
            <div className="mission-container">
              <div className="mission-left">
                <h2 className="section-title">
                  Giảng viên từ các công ty công nghệ hàng đầu
                </h2>
                <p className="mission-text">
                  Tất cả giảng viên trên Coursevo đều là những chuyên gia đang
                  làm việc thực tế trong ngành IT với tối thiểu 5 năm kinh
                  nghiệm.
                </p>

                <div className="instructor-examples">
                  <div className="instructor-card">
                    <div className="instructor-avatar">
                      <img
                        src="https://cdn-images.vtv.vn/zoom/554_346/66349b6076cb4dee98746cf1/2025/10/01/68c1e77d57d362d375e7ee50-55079870634772221646868-35600809372372531539111.webp"
                        alt="Instructor"
                      />
                    </div>
                    <div className="instructor-info">
                      <h4>Nguyễn Văn A</h4>
                      <p className="instructor-role">
                        Senior Backend Developer @VNG
                      </p>
                      <p className="instructor-exp">
                        8 năm kinh nghiệm • Java, Spring Boot, Microservices
                      </p>
                    </div>
                  </div>

                  <div className="instructor-card">
                    <div className="instructor-avatar">
                      <img
                        src="https://vcdn1-vnexpress.vnecdn.net/2025/06/29/Zillow-CEO-JeremyWacksman-tron-6191-3318-1751136149.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=Z-oZwtUO-Ohm49OR24dgDA"
                        alt="Instructor"
                      />
                    </div>
                    <div className="instructor-info">
                      <h4>Trần Thị B</h4>
                      <p className="instructor-role">Tech Lead @FPT Software</p>
                      <p className="instructor-exp">
                        10 năm kinh nghiệm • React, Node.js, AWS
                      </p>
                    </div>
                  </div>

                  <div className="instructor-card">
                    <div className="instructor-avatar">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZaf7GOS7_0Oe8TsSYuDYjQq_J-rnpaKmDhA&s"
                        alt="Instructor"
                      />
                    </div>
                    <div className="instructor-info">
                      <h4>Lê Thị C</h4>
                      <p className="instructor-role">
                        Solution Architect @Viettel
                      </p>
                      <p className="instructor-exp">
                        12 năm kinh nghiệm • System Design, Kubernetes, DevOps
                      </p>
                    </div>
                  </div>
                </div>

                <Link to="/instructor-registration" className="btn-primary">
                  ĐĂNG KÝ GIẢNG VIÊN
                </Link>
              </div>
              <div className="mission-right">
                <div className="video-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800"
                    alt="Professional instructor"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Học viên */}
          {activeTab === 2 && (
            <div className="mission-container">
              <div className="mission-left">
                <h2 className="section-title">
                  Học viên thành công sau khóa học
                </h2>
                <p className="mission-text">
                  Hơn 85% học viên hoàn thành khóa học tìm được việc làm trong
                  vòng 3 tháng với mức lương khởi điểm từ 10-15 triệu/tháng.
                </p>

                <div className="student-testimonials">
                  <div className="testimonial-card">
                    <div className="testimonial-header">
                      <img
                        src="https://ui-avatars.com/api/?name=Pham+Van+D&size=60&background=random"
                        alt="Student"
                      />
                      <div>
                        <h4>Phạm Văn D</h4>
                        <p className="student-role">
                          Junior Developer @TMA Solutions
                        </p>
                      </div>
                    </div>
                    <p className="testimonial-text">
                      "Từ sinh viên mới ra trường, sau 6 tháng học Spring Boot
                      với anh A, mình đã có việc làm với mức lương 12 triệu.
                      Kiến thức thực tế và dự án thực chiến giúp mình tự tin
                      trong phỏng vấn."
                    </p>
                    <div className="testimonial-course">
                      <span>Khóa học: Spring Boot Microservices</span>
                    </div>
                  </div>

                  <div className="testimonial-card">
                    <div className="testimonial-header">
                      <img
                        src="https://ui-avatars.com/api/?name=Hoang+Thi+E&size=60&background=random"
                        alt="Student"
                      />
                      <div>
                        <h4>Hoàng Thị E</h4>
                        <p className="student-role">
                          Frontend Developer @Sendo
                        </p>
                      </div>
                    </div>
                    <p className="testimonial-text">
                      "Chuyển nghề từ marketing sang lập trình. Các khóa React
                      và TypeScript rất chi tiết và dễ hiểu. Giảng viên support
                      nhiệt tình, giờ mình đã làm được 1 năm rồi!"
                    </p>
                    <div className="testimonial-course">
                      <span>Khóa học: React & TypeScript Advanced</span>
                    </div>
                  </div>

                  <div className="testimonial-card">
                    <div className="testimonial-header">
                      <img
                        src="https://ui-avatars.com/api/?name=Do+Van+F&size=60&background=random"
                        alt="Student"
                      />
                      <div>
                        <h4>Đỗ Văn F</h4>
                        <p className="student-role">DevOps Engineer @Shopee</p>
                      </div>
                    </div>
                    <p className="testimonial-text">
                      "Khóa DevOps & Kubernetes thực sự chất lượng. Từ junior
                      backend, mình chuyển sang DevOps với mức lương tăng gấp
                      đôi. Cảm ơn anh C đã hướng dẫn tận tình!"
                    </p>
                    <div className="testimonial-course">
                      <span>Khóa học: DevOps & Kubernetes in Production</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mission-right">
                <div className="video-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800"
                    alt="Successful students"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Partners Section */}
        <section className="partners-section">
          <h2 className="section-title">
            CÁC CÔNG TY CỰU HỌC VIÊN COURSEVO ĐANG LÀM VIỆC
          </h2>
          <p className="partners-subtitle">
            100% học viên sau khi hoàn thành dự án đều có công việc như mong đợi
            tại các tập đoàn phần mềm, các công ty phần mềm đa quốc gia, các
            công ty khởi nghiệp...với thu nhập từ 90~140 triệu/1 năm.
          </p>
          <div className="partners-grid">
            <div className="partner-logo">
              <img
                src="https://cdn.dribbble.com/userupload/14907507/file/original-72e975bc433699f5a454953ce27c5ae0.jpg?resize=752x&vertical=center"
                alt="Unicorn"
              />
            </div>
            <div className="partner-logo">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNLDSEgjzJ_njgJPJ-5qBqJjAOJ3JKP7dfMA&s"
                alt="FPT"
              />
            </div>
            <div className="partner-logo">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS29qA4irXYnasPzyhqABn_42_Png5i8Qhx_g&s"
                alt="Synergix"
              />
            </div>
            <div className="partner-logo">
              <img
                src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/5aglfbprsxA8rdvwGkmmpLEn2SmMCPyV_1658140107____8bc15ed35107f63aeac87e25e97e2449.png"
                alt="DXC"
              />
            </div>
            <div className="partner-logo">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpWuov1FaVQCLOUTG42lHCWtzV2pgDbLScQA&s"
                alt="Nash Tech"
              />
            </div>
            <div className="partner-logo">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHkvaVQ7dgoKrzS88PDIL_zsuS4_kxWX3DDQ&s"
                alt="Gotadi"
              />
            </div>
            <div className="partner-logo">
              <img
                src="https://static.vecteezy.com/system/resources/previews/009/359/158/non_2x/cloud-coaching-logo-design-concept-for-leadership-company-business-consultant-or-etc-light-blue-color-identity-with-white-background-vector.jpg"
                alt="Coaching Cloud"
              />
            </div>
            <div className="partner-logo">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0dtP8d8FpltU6oI-vfJIJfDAUvP04CKoPDw&s"
                alt="Eyeq"
              />
            </div>
            <div className="partner-logo">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXU2f5Ny_VmIEqVa_GjJv6HwnuXBEsjgeqMw&s"
                alt="VNPT-IT"
              />
            </div>
            <div className="partner-logo">
              <img
                src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NDk4MDUwMCwicHVyIjoiYmxvYl9pZCJ9fQ==--c78186bcdc3fae39ab518a50cfe1a72106d977dc/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOlszMDAsMzAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--e1d036817a0840c585f202e70291f5cdd058753d/NAB_Logo_RGB_1x1.png"
                alt="NAB"
              />
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
