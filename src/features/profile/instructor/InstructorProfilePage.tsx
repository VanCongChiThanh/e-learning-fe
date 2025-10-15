import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInstructorProfileById, InstructorProfileResponse } from "../api";
import MainLayout from "../../../layouts/MainLayout";
import "./InstructorProfilePage.scss";

const InstructorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<InstructorProfileResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "courses" | "reviews">(
    "about"
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setError("ID giảng viên không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getInstructorProfileById(id);
        setProfile(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching instructor profile:", err);
        setError(
          err.response?.data?.message || "Không thể tải hồ sơ giảng viên"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="instructor-profile-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải hồ sơ giảng viên...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <div className="instructor-profile-page">
          <div className="error-container">
            <i className="fas fa-exclamation-circle"></i>
            <h2>Không thể tải hồ sơ</h2>
            <p>{error || "Giảng viên không tồn tại"}</p>
            <button onClick={() => navigate(-1)} className="btn-back">
              <i className="fas fa-arrow-left"></i> Quay lại
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: "fab fa-linkedin",
      url: profile.linkedin,
      className: "linkedin",
    },
    {
      name: "GitHub",
      icon: "fab fa-github",
      url: profile.github,
      className: "github",
    },
    {
      name: "Facebook",
      icon: "fab fa-facebook",
      url: profile.facebook,
      className: "facebook",
    },
    {
      name: "YouTube",
      icon: "fab fa-youtube",
      url: profile.youtube,
      className: "youtube",
    },
    {
      name: "Website",
      icon: "fas fa-globe",
      url: profile.personal_website,
      className: "website",
    },
  ].filter((link) => link.url);

  const stats = {
    totalCourses: 0,
    totalStudents: 3,
    totalReviews: 1,
    averageRating: 4.5,
  };

  const avatar =
    profile.user_info.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile.user_info.name
    )}&size=300&background=106c54&color=fff&bold=true`;

  return (
    <MainLayout>
      <div className="instructor-profile-page">
        {/* Hero Section */}
        <div className="profile-hero">
          <div className="container">
            <div className="hero-wrapper">
              {/* Left: Avatar */}
              <div className="instructor-avatar-section">
                <div className="avatar-card">
                  <img
                    src={avatar}
                    alt={profile.user_info.name}
                    className="avatar-image"
                  />
                </div>
                {socialLinks.length > 0 && (
                  <div className="social-links">
                    {socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`social-link ${link.className}`}
                        title={link.name}
                      >
                        <i className={link.icon}></i>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Info */}
              <div className="instructor-info-section">
                <div className="info-header">
                  <span className="instructor-badge">Giảng Viên</span>
                  <h1 className="instructor-name">{profile.user_info.name}</h1>
                  {profile.headline && (
                    <p className="instructor-headline">{profile.headline}</p>
                  )}
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <i className="fas fa-book-open stat-icon"></i>
                    <div className="stat-content">
                      <span className="stat-value">{stats.totalCourses}</span>
                      <span className="stat-label">Khóa học</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-users stat-icon"></i>
                    <div className="stat-content">
                      <span className="stat-value">{stats.totalStudents}</span>
                      <span className="stat-label">Học viên</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-star stat-icon"></i>
                    <div className="stat-content">
                      <span className="stat-value">{stats.totalReviews}</span>
                      <span className="stat-label">Đánh giá</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-award stat-icon"></i>
                    <div className="stat-content">
                      <span className="stat-value">
                        {stats.averageRating.toFixed(1)}
                      </span>
                      <span className="stat-label">Xếp hạng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section with Tabs */}
        <div className="profile-content">
          <div className="container">
            <div className="content-tabs-wrapper">
              {/* Tab Navigation */}
              <div className="tabs-navigation">
                <button
                  className={`tab-button ${
                    activeTab === "about" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("about")}
                >
                  <i className="fas fa-user-circle"></i>
                  <span>Giới thiệu</span>
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "courses" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("courses")}
                >
                  <i className="fas fa-book-open"></i>
                  <span>Khóa học</span>
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "reviews" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  <i className="fas fa-star"></i>
                  <span>Đánh giá</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {/* About Tab */}
                {activeTab === "about" && (
                  <div className="tab-pane about-pane">
                    {profile.bio ? (
                      <p className="bio-text">{profile.bio}</p>
                    ) : (
                      <div className="empty-state">
                        <i className="fas fa-info-circle"></i>
                        <p>Chưa có thông tin về giảng viên</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Courses Tab */}
                {activeTab === "courses" && (
                  <div className="tab-pane courses-pane">
                    <div className="empty-state">
                      <i className="fas fa-book"></i>
                      <p>Chưa có khóa học nào</p>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="tab-pane reviews-pane">
                    <div className="empty-state">
                      <i className="fas fa-comment-dots"></i>
                      <p>Chưa có đánh giá nào</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InstructorProfilePage;
