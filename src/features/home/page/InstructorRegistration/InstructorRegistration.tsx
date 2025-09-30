import MainLayout from "../../../../layouts/MainLayout";
import "./InstructorRegistration.scss";
const InstructorRegistration = () => {
  return (
    <MainLayout>
      <section className="hero">
        <div className="container">
          <h1>Trở thành Giảng Viên của Coursevo</h1>
          <p>
            Chia sẻ kiến thức của bạn với hàng triệu học viên trên toàn thế giới
            và xây dựng sự nghiệp giảng dạy trực tuyến
          </p>
        </div>
      </section>

      <main className="main-content">
          <div className="registration-wrapper">
            <aside className="benefits">
              <h2>Lợi ích khi tham gia</h2>

              <div className="benefit-item">
                <div className="benefit-icon">💰</div>
                <div className="benefit-content">
                  <h3>Thu nhập hấp dẫn</h3>
                  <p>
                    Nhận đến 70% doanh thu từ khóa học của bạn với mô hình chia
                    sẻ minh bạch
                  </p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">🌍</div>
                <div className="benefit-content">
                  <h3>Tiếp cận toàn cầu</h3>
                  <p>
                    Kết nối với hàng triệu học viên trên khắp thế giới đang khao
                    khát học hỏi
                  </p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">🛠️</div>
                <div className="benefit-content">
                  <h3>Công cụ chuyên nghiệp</h3>
                  <p>
                    Sử dụng nền tảng hiện đại với đầy đủ công cụ tạo và quản lý
                    khóa học
                  </p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">📊</div>
                <div className="benefit-content">
                  <h3>Hỗ trợ marketing</h3>
                  <p>
                    Được hỗ trợ quảng bá khóa học qua các kênh marketing của
                    chúng tôi
                  </p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">🎓</div>
                <div className="benefit-content">
                  <h3>Đào tạo miễn phí</h3>
                  <p>
                    Tham gia các khóa đào tạo về kỹ năng giảng dạy trực tuyến
                    hoàn toàn miễn phí
                  </p>
                </div>
              </div>
            </aside>

            <div className="form-container">
              <div className="form-header">
                <h2>Đăng ký làm giảng viên</h2>
                <p>
                  Điền thông tin bên dưới để bắt đầu hành trình giảng dạy của
                  bạn
                </p>
              </div>

              <form id="instructorForm">
                <div className="form-section">
                  <h3 className="form-section-title">Thông tin cá nhân</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">
                        Họ <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        placeholder="Nguyễn"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName">
                        Tên <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        placeholder="Văn A"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">
                        Email <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">
                        Số điện thoại <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        placeholder="0912345678"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Thông tin chuyên môn</h3>

                  <div className="form-group">
                    <label htmlFor="expertise">
                      Lĩnh vực chuyên môn <span className="required">*</span>
                    </label>
                    <select id="expertise" name="expertise" required>
                      <option value="">Chọn lĩnh vực</option>
                      <option value="programming">Lập trình & Công nghệ</option>
                      <option value="business">Kinh doanh & Quản lý</option>
                      <option value="design">Thiết kế & Sáng tạo</option>
                      <option value="marketing">
                        Marketing & Truyền thông
                      </option>
                      <option value="language">Ngoại ngữ</option>
                      <option value="personal">Phát triển bản thân</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="education">
                      Trình độ học vấn <span className="required">*</span>
                    </label>
                    <select id="education" name="education" required>
                      <option value="">Chọn trình độ</option>
                      <option value="bachelor">Cử nhân</option>
                      <option value="master">Thạc sĩ</option>
                      <option value="phd">Tiến sĩ</option>
                      <option value="professional">Chứng chỉ chuyên môn</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="experience">
                      Số năm kinh nghiệm <span className="required">*</span>
                    </label>
                    <select id="experience" name="experience" required>
                      <option value="">Chọn số năm</option>
                      <option value="0-2">0-2 năm</option>
                      <option value="3-5">3-5 năm</option>
                      <option value="6-10">6-10 năm</option>
                      <option value="10+">Trên 10 năm</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">
                      Giới thiệu bản thân <span className="required">*</span>
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      required
                      placeholder="Hãy chia sẻ về kinh nghiệm, thành tựu và lý do bạn muốn trở thành giảng viên..."
                    ></textarea>
                  </div>
                </div>
                <div className="form-section">
                  <h3 className="form-section-title">Thông tin khóa học</h3>

                  <div className="form-group">
                    <label htmlFor="courseTitle">Tên khóa học dự kiến</label>
                    <input
                      type="text"
                      id="courseTitle"
                      name="courseTitle"
                      placeholder="VD: Lập trình Python từ cơ bản đến nâng cao"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="courseDescription">Mô tả khóa học</label>
                    <textarea
                      id="courseDescription"
                      name="courseDescription"
                      placeholder="Mô tả ngắn gọn về nội dung và mục tiêu của khóa học..."
                    ></textarea>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Thông tin bổ sung</h3>

                  <div className="form-group">
                    <label htmlFor="linkedin">LinkedIn Profile</label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="portfolio">Website/Portfolio</label>
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cv">Tải lên CV/Resume</label>
                    <div className="file-input-wrapper">
                      <label htmlFor="cv" className="file-input-label">
                        📎 Chọn file (PDF, DOC, DOCX)
                      </label>
                      <input
                        type="file"
                        id="cv"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input type="checkbox" id="terms" name="terms" required />
                    <label htmlFor="terms" className="checkbox-label">
                      Tôi đồng ý với <a href="#terms">Điều khoản sử dụng</a> và{" "}
                      <a href="#privacy">Chính sách bảo mật</a> của EduLearn{" "}
                      <span className="required">*</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input type="checkbox" id="newsletter" name="newsletter" />
                    <label htmlFor="newsletter" className="checkbox-label">
                      Tôi muốn nhận thông tin về các chương trình hỗ trợ giảng
                      viên và cập nhật từ EduLearn
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Gửi đơn đăng ký
                </button>
              </form>
            </div>
          </div>
      </main>
    </MainLayout>
  );
};

export default InstructorRegistration;
