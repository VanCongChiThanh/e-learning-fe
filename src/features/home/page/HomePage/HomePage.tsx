import { Link } from "react-router-dom";
import MainLayout from "../../../../layouts/MainLayout";
import "./HomePage.scss";
import HomeLayout from "../../layout/HomeLayout";

const HomePage = () => {
  // Mock data - sẽ thay bằng API sau
  const trendingCourses = [
    {
      id: 1,
      title: "The Complete JavaScript Course 2024: From Zero to Expert!",
      instructor: "Nguyễn Văn A",
      rating: 4.7,
      students: 324523,
      price: 1299000,
      originalPrice: 2999000,
      image: "https://img-c.udemycdn.com/course/240x135/851712_fc61_6.jpg",
      bestseller: true,
    },
    {
      id: 2,
      title: "React - The Complete Guide 2024 (incl. Next.js, Redux)",
      instructor: "Trần Thị B",
      rating: 4.6,
      students: 289012,
      price: 1399000,
      originalPrice: 2999000,
      image: "https://img-c.udemycdn.com/course/240x135/1362070_b9a1_2.jpg",
      bestseller: true,
    },
    {
      id: 3,
      title: "100 Days of Code: The Complete Python Pro Bootcamp",
      instructor: "Lê Văn C",
      rating: 4.7,
      students: 412390,
      price: 1299000,
      originalPrice: 2999000,
      image: "https://img-c.udemycdn.com/course/240x135/2776760_f176_10.jpg",
      bestseller: true,
    },
    {
      id: 4,
      title: "Complete Web & Mobile Designer: UI/UX, Figma, +more",
      instructor: "Phạm Thị D",
      rating: 4.8,
      students: 201234,
      price: 1399000,
      originalPrice: 2999000,
      image: "https://img-c.udemycdn.com/course/240x135/1754098_e0df_3.jpg",
      bestseller: false,
    },
  ];

  const categories = [
    { name: "Development", icon: "fa-code" },
    { name: "Business", icon: "fa-briefcase" },
    { name: "Design", icon: "fa-palette" },
    { name: "IT & Software", icon: "fa-server" },
    { name: "Marketing", icon: "fa-bullhorn" },
    { name: "Personal Development", icon: "fa-user" },
  ];

  return (
    <MainLayout>
      <HomeLayout>
        <div className="home-page">
          {/* Welcome Banner */}
          <section className="welcome-banner">
            <div className="welcome-content">
              <div className="welcome-text">
                <h1>Chào mừng bạn đến với Coursevo</h1>
                <p>
                  Khám phá hơn 200+ khóa học IT chất lượng cao từ các chuyên gia
                  hàng đầu. Bắt đầu hành trình phát triển kỹ năng của bạn ngay
                  hôm nay!
                </p>
                <Link to="/courses/search" className="cta-button">
                  Khám phá khóa học
                </Link>
              </div>
              <div className="welcome-illustration">
                <img
                  src="https://img-c.udemycdn.com/notices/web_carousel_slide/image/db24b94e-d190-4d5a-b1dd-958f702cc8f5.jpg"
                  alt="Learning illustration"
                />
              </div>
            </div>
          </section>

          {/* Categories Tabs */}
          <section className="categories-section">
            <div className="container">
              <h2>Danh mục phổ biến</h2>
              <div className="categories-tabs">
                {categories.map((cat, index) => (
                  <Link
                    key={index}
                    to={`/courses/search?category=${cat.name}`}
                    className="category-tab"
                  >
                    <i className={`fa-solid ${cat.icon}`}></i>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Trending Courses */}
          <section className="courses-section">
            <div className="container">
              <h2>Khóa học thịnh hành</h2>
              <p className="section-subtitle">
                Những khóa học được học viên yêu thích nhất
              </p>
              <div className="courses-grid">
                {trendingCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="course-card"
                  >
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                      {course.bestseller && (
                        <span className="bestseller-badge">Bán chạy</span>
                      )}
                    </div>
                    <div className="course-info">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-instructor">{course.instructor}</p>
                      <div className="course-rating">
                        <span className="rating-number">{course.rating}</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${
                                i < Math.floor(course.rating) ? "filled" : ""
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="students-count">
                          ({course.students.toLocaleString()})
                        </span>
                      </div>
                      <div className="course-price">
                        <span className="current-price">
                          {course.price.toLocaleString()}₫
                        </span>
                        <span className="original-price">
                          {course.originalPrice.toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Development Section */}
          <section className="courses-section">
            <div className="container">
              <h2>Top khóa học Development</h2>
              <p className="section-subtitle">
                Học lập trình từ cơ bản đến nâng cao với các chuyên gia
              </p>
              <div className="courses-grid">
                {trendingCourses.slice(0, 4).map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="course-card"
                  >
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                    </div>
                    <div className="course-info">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-instructor">{course.instructor}</p>
                      <div className="course-rating">
                        <span className="rating-number">{course.rating}</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${
                                i < Math.floor(course.rating) ? "filled" : ""
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="students-count">
                          ({course.students.toLocaleString()})
                        </span>
                      </div>
                      <div className="course-price">
                        <span className="current-price">
                          {course.price.toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Design Section */}
          <section className="courses-section">
            <div className="container">
              <h2>Top khóa học Design</h2>
              <p className="section-subtitle">
                Nâng cao kỹ năng thiết kế UI/UX và đồ họa
              </p>
              <div className="courses-grid">
                {trendingCourses.slice(0, 4).map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="course-card"
                  >
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                    </div>
                    <div className="course-info">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-instructor">{course.instructor}</p>
                      <div className="course-rating">
                        <span className="rating-number">{course.rating}</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${
                                i < Math.floor(course.rating) ? "filled" : ""
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="students-count">
                          ({course.students.toLocaleString()})
                        </span>
                      </div>
                      <div className="course-price">
                        <span className="current-price">
                          {course.price.toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Business Section */}
          <section className="courses-section">
            <div className="container">
              <h2>Top khóa học Business</h2>
              <p className="section-subtitle">
                Phát triển kỹ năng quản lý và kinh doanh
              </p>
              <div className="courses-grid">
                {trendingCourses.slice(0, 4).map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="course-card"
                  >
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                    </div>
                    <div className="course-info">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-instructor">{course.instructor}</p>
                      <div className="course-rating">
                        <span className="rating-number">{course.rating}</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${
                                i < Math.floor(course.rating) ? "filled" : ""
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="students-count">
                          ({course.students.toLocaleString()})
                        </span>
                      </div>
                      <div className="course-price">
                        <span className="current-price">
                          {course.price.toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* IT & Software Section */}
          <section className="courses-section">
            <div className="container">
              <h2>Top khóa học IT & Software</h2>
              <p className="section-subtitle">
                Học IT từ cơ bản đến chuyên sâu
              </p>
              <div className="courses-grid">
                {trendingCourses.slice(0, 4).map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="course-card"
                  >
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                    </div>
                    <div className="course-info">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-instructor">{course.instructor}</p>
                      <div className="course-rating">
                        <span className="rating-number">{course.rating}</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${
                                i < Math.floor(course.rating) ? "filled" : ""
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="students-count">
                          ({course.students.toLocaleString()})
                        </span>
                      </div>
                      <div className="course-price">
                        <span className="current-price">
                          {course.price.toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </HomeLayout>
    </MainLayout>
  );
};

export default HomePage;
