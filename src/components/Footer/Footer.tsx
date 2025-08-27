import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Intro */}
        <div>
          <h2 className="text-2xl font-bold text-white">E-Learning</h2>
          <p className="mt-3 text-sm text-gray-400">
            Nền tảng học trực tuyến giúp bạn nâng cao kỹ năng và phát triển sự
            nghiệp.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Khóa học</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/khoa-hoc/tatca" className="hover:text-white">
                Tất cả khóa học
              </Link>
            </li>
            <li>
              <Link to="/khoa-hoc/noi-bat" className="hover:text-white">
                Khóa học nổi bật
              </Link>
            </li>
            <li>
              <Link to="/khoa-hoc/mien-phi" className="hover:text-white">
                Khóa học miễn phí
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-white">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white">
                Câu hỏi thường gặp
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Kết nối</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              Facebook
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              YouTube
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} E-Learning. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
