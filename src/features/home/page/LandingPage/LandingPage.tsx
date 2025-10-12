import "./LandingPage.scss";
import MainLayout from "../../../../layouts/MainLayout";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
gsap.registerPlugin(ScrollTrigger);
export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const benefitsSection = document.querySelector(
      ".benefits-section"
    ) as HTMLElement | null;
    const benefitsWrapper = document.querySelector(
      ".benefits-wrapper"
    ) as HTMLElement | null;
    const items = gsap.utils.toArray<HTMLElement>(".benefit-item");

    if (!benefitsSection || !benefitsWrapper || items.length === 0) return;

    // Tính toán khoảng cách scroll chính xác dựa trên width thực tế của wrapper
    const totalWidth = benefitsWrapper.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = totalWidth - viewportWidth;

    gsap.to(benefitsWrapper, {
      x: () => -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: benefitsSection,
        pin: true,
        scrub: 1,
        end: `+=${scrollDistance}`,
        onUpdate: (self) => {
          // Tính toán slide hiện tại dựa trên progress
          const progress = self.progress;
          const currentSlide = Math.round(progress * (items.length - 1));
          setActiveSlide(currentSlide);
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
                <button className="play-button">
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
                <span className="title-line">KHỞI ĐẦU</span>
                <span className="title-line">SỰ NGHIỆP</span>
                <span className="title-line">CỦA BẠN</span>
              </h1>

              <p className="hero-subtitle">
                Học thật, dự án thật, việc làm thật
                <br />
                Trở thành lập trình chuyên nghiệp
                <br />
                tại Coursevo
              </p>

              <div className="hero-buttons">
                <Link to="/courses/search" className="btn-primary">
                  Xem khoá học
                </Link>
                <button className="btn-outline">TƯ VẤN & ĐĂNG KÝ</button>
              </div>
            </div>
          </div>

          <div className="sidebar-menu">
            <button className="sidebar-item">☰</button>
            <button className="sidebar-item">⊞</button>
            <button className="sidebar-item">📧</button>
            <button className="sidebar-item">📞</button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">5014</div>
              <div className="stat-label">Khóa học & videos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3890</div>
              <div className="stat-label">Học viên offline</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15</div>
              <div className="stat-label">Năm kinh nghiệm</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">54</div>
              <div className="stat-label">Đối tác</div>
            </div>
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
                  Kết nối với giảng viên chất lượng
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
                <h3 className="benefit-title">Thực hành với AI Feedback</h3>
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
                <h3 className="benefit-title">Học qua dự án thực tế</h3>
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
                <h3 className="benefit-title">Cộng đồng năng động</h3>
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
            <button className="mission-tab active">Coursevo là ai ?</button>
            <button className="mission-tab">Học viên nhận xét</button>
            <button className="mission-tab">Cựu học viên</button>
          </div>

          <div className="mission-container">
            <div className="mission-left">
              <h2 className="section-title">
                Chúng tôi tin vào tiềm năng của con người
              </h2>
              <p className="mission-text">
                Coursevo được xây dựng bởi đội ngũ giảng viên dày dạn kinh
                nghiệm từ các công ty công nghệ hàng đầu. Chúng tôi được thành
                lập dựa trên niềm tin rằng bất cứ ai cũng có thể học lập trình.
              </p>
              <p className="mission-text">
                Bất kể ai cũng có thể là một lập trình viên, tham gia trong đội
                ngũ Tech, bất kể tuổi tác, nền tảng, giới tính hoặc tình trạng
                tài chính. Chúng tôi không bỏ qua những người mới bắt đầu hoặc
                chưa có kinh nghiệm. Thay vào đó, chúng tôi chào đón học viên
                của tất cả các cấp độ kinh nghiệm.
              </p>
              <button className="btn-primary">SỨ MỆNH ĐÀO TẠO</button>
            </div>
            <div className="mission-right">
              <div className="video-wrapper">
                <img
                  src="https://www.simplilearn.com/ice9/free_resources_article_thumb/Why_E-Learning_Insights_into_the_World_of_Online_Learning_and_Development.jpg"
                  alt="Students learning in classroom"
                />
                <button className="play-button-overlay" aria-label="Play video">
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
