import React, { useState, ChangeEvent, FormEvent } from "react";
import "./InstructorRegistration.scss";
import { applyInstructor, ApplyInstructorRequest } from "../../api";
import {
  getPresignedUrl,
  uploadFileToS3,
} from "../../../../services/file-service";
import { toast } from "react-toastify";
interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  expertise: string;
  education: string;
  experience: string;
  bio: string;
  course_title: string;
  course_description: string;
  linkedin: string;
  portfolio: string;
  cv: File | null;
  terms: boolean;
  newsletter: boolean;
}

const InstructorRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    expertise: "",
    education: "",
    experience: "",
    bio: "",
    course_title: "",
    course_description: "",
    linkedin: "",
    portfolio: "",
    cv: null,
    terms: false,
    newsletter: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cvPreview, setCvPreview] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    if (type === "checkbox" && target instanceof HTMLInputElement) {
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else if (type !== "file") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, cv: file }));

    if (file) {
      setCvPreview(URL.createObjectURL(file)); // chỉ tạo URL preview
    } else {
      setCvPreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let cv_url = "";
      if (formData.cv) {
        const ext = "." + formData.cv.name.split(".").pop()?.toLowerCase();
        const { url, key } = await getPresignedUrl(ext);
        await uploadFileToS3(url, formData.cv);
        cv_url = `https://e-learning-data.s3.us-east-1.amazonaws.com/${encodeURIComponent(
          key
        )}`;
      }

      const payload: ApplyInstructorRequest = {
        cv_url,
        portfolio_link: formData.portfolio,
        motivation: formData.bio,
        extra_info: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          expertise: formData.expertise,
          education: formData.education,
          experience: formData.experience,
          course_title: formData.course_title,
          course_description: formData.course_description,
          linkedin: formData.linkedin,
          newsletter: formData.newsletter,
        },
      };

      await applyInstructor(payload);

      setSuccess(true);
      toast.success(
        "Gửi đơn đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm."
      );
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        expertise: "",
        education: "",
        experience: "",
        bio: "",
        course_title: "",
        course_description: "",
        linkedin: "",
        portfolio: "",
        cv: null,
        terms: false,
        newsletter: false,
      });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Có lỗi xảy ra khi gửi đơn!";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="instructor-registration-page ">
        <section className="hero">
          <div className="container">
            <h1>Trở thành Giảng Viên của Coursevo</h1>
            <p>Chia sẻ kiến thức và xây dựng sự nghiệp giảng dạy trực tuyến</p>
          </div>
        </section>

        <main className="main-content mx-3">
          <div className="registration-wrapper">
            <aside className="benefits">
              <h2>Lợi ích khi tham gia</h2>{" "}
              <div className="benefit-item">
                {" "}
                <div className="benefit-icon">💰</div>{" "}
                <div className="benefit-content">
                  {" "}
                  <h3>Thu nhập hấp dẫn</h3>{" "}
                  <p>
                    {" "}
                    Nhận đến 70% doanh thu từ khóa học của bạn với mô hình chia
                    sẻ minh bạch{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="benefit-item">
                {" "}
                <div className="benefit-icon">🌍</div>{" "}
                <div className="benefit-content">
                  {" "}
                  <h3>Tiếp cận toàn cầu</h3>{" "}
                  <p>
                    {" "}
                    Kết nối với hàng triệu học viên trên khắp thế giới đang khao
                    khát học hỏi{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="benefit-item">
                {" "}
                <div className="benefit-icon">🛠️</div>{" "}
                <div className="benefit-content">
                  {" "}
                  <h3>Công cụ chuyên nghiệp</h3>{" "}
                  <p>
                    {" "}
                    Sử dụng nền tảng hiện đại với đầy đủ công cụ tạo và quản lý
                    khóa học{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="benefit-item">
                {" "}
                <div className="benefit-icon">📊</div>{" "}
                <div className="benefit-content">
                  {" "}
                  <h3>Hỗ trợ marketing</h3>{" "}
                  <p>
                    {" "}
                    Được hỗ trợ quảng bá khóa học qua các kênh marketing của
                    chúng tôi{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="benefit-item">
                {" "}
                <div className="benefit-icon">🎓</div>{" "}
                <div className="benefit-content">
                  {" "}
                  <h3>Đào tạo miễn phí</h3>{" "}
                  <p>
                    {" "}
                    Tham gia các khóa đào tạo về kỹ năng giảng dạy trực tuyến
                    hoàn toàn miễn phí{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </aside>

            <div className="form-container">
              <div className="form-header">
                <h2>Đăng ký làm giảng viên</h2>
                <p>
                  Điền thông tin bên dưới để bắt đầu hành trình giảng dạy của
                  bạn
                </p>
              </div>

              <form id="instructorForm" onSubmit={handleSubmit}>
                {/* Personal Info */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      Họ <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="first_name"
                      placeholder="Nguyễn"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">
                      Tên <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="last_name"
                      placeholder="Văn A"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
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
                      placeholder="0912345678"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Expertise */}
                <div className="form-group">
                  <label htmlFor="expertise">Lĩnh vực chuyên môn</label>
                  <select
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                  >
                    <option value="">Chọn lĩnh vực</option>
                    <option value="programming">Lập trình & Công nghệ</option>
                    <option value="business">Kinh doanh & Quản lý</option>
                    <option value="design">Thiết kế & Sáng tạo</option>
                    <option value="marketing">Marketing & Truyền thông</option>
                    <option value="language">Ngoại ngữ</option>
                    <option value="personal">Phát triển bản thân</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                {/* Education */}
                <div className="form-group">
                  <label htmlFor="education">Trình độ học vấn</label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                  >
                    <option value="">Chọn trình độ</option>
                    <option value="bachelor">Cử nhân</option>
                    <option value="master">Thạc sĩ</option>
                    <option value="phd">Tiến sĩ</option>
                    <option value="professional">Chứng chỉ chuyên môn</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                {/* Experience */}
                <div className="form-group">
                  <label htmlFor="experience">Số năm kinh nghiệm</label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                  >
                    <option value="">Chọn số năm</option>
                    <option value="0-2">0-2 năm</option>
                    <option value="3-5">3-5 năm</option>
                    <option value="6-10">6-10 năm</option>
                    <option value="10+">Trên 10 năm</option>
                  </select>
                </div>

                {/* Motivation */}
                <div className="form-group">
                  <label htmlFor="bio">
                    Giới thiệu bản thân <span className="required">*</span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Chia sẻ kinh nghiệm, thành tựu..."
                    value={formData.bio}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Course info */}
                <div className="form-group">
                  <label htmlFor="courseTitle">Tên khóa học dự kiến</label>
                  <input
                    type="text"
                    id="course_title"
                    name="course_title"
                    value={formData.course_title}
                    onChange={handleChange}
                    placeholder="VD: Lập trình Python từ cơ bản đến nâng cao"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="courseDescription">Mô tả khóa học</label>
                  <textarea
                    id="course_description"
                    name="course_description"
                    value={formData.course_description}
                    onChange={handleChange}
                    placeholder="Mô tả ngắn gọn về nội dung và mục tiêu..."
                  ></textarea>
                </div>

                {/* Extra info */}
                <div className="form-group">
                  <label htmlFor="linkedin">LinkedIn Profile</label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="portfolio">
                    Website/Portfolio <span className="required">*</span>
                  </label>
                  <input
                    type="url"
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cv">
                    Tải lên CV/Resume <span className="required">*</span>
                  </label>
                  <div className="file-input-wrapper">
                    <label htmlFor="cv" className="file-input-label">
                      📎 Chọn file (PDF, DOC, DOCX)
                    </label>
                    <input
                      type="file"
                      id="cv"
                      name="cv"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  {cvPreview && (
                    <div className="cv-preview">
                      <p className="text-blue-500">{formData.cv?.name}</p>
                    </div>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="terms" className="checkbox-label">
                      Tôi đồng ý với <a href="#terms">Điều khoản</a> và{" "}
                      <a href="#privacy">Chính sách bảo mật</a>{" "}
                      <span className="required">*</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                    />
                    <label htmlFor="newsletter" className="checkbox-label">
                      Nhận thông tin về các chương trình hỗ trợ giảng viên
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Đang gửi..." : "Gửi đơn đăng ký"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
  );
};

export default InstructorRegistration;
