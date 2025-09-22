import React, { useState } from "react";

const reviews = [
  {
    name: "Nguyễn Văn A",
    rating: 5,
    time: "3 ngày trước",
    content:
      "Khóa học Spring Boot cơ bản rất dễ hiểu. Giảng viên giải thích chi tiết từ cấu trúc project đến cách xây dựng API. Sau khi học xong, tôi đã tự làm được một ứng dụng CRUD nhỏ.",
    helpful: 14,
  },
  {
    name: "Trần Thị B",
    rating: 4,
    time: "1 tuần trước",
    content:
      "Nội dung bài giảng khá đầy đủ, phù hợp cho người mới bắt đầu. Nếu có thêm phần hướng dẫn triển khai lên server thực tế thì sẽ tuyệt hơn.",
    helpful: 9,
  },
  {
    name: "Lê Minh C",
    rating: 5,
    time: "2 tuần trước",
    content:
      "Mình đã thử nhiều khóa học online, nhưng đây là khóa học Spring Boot dễ tiếp cận nhất. Từ dependency, annotation cho đến cấu hình đều được giải thích rõ ràng.",
    helpful: 11,
  },
  {
    name: "Phạm Dũng",
    rating: 3,
    time: "2 tuần trước",
    content:
      "Khóa học ổn, nhưng tốc độ giảng hơi nhanh. Mình phải tua lại vài lần để nắm kịp phần JPA.",
    helpful: 3,
  },
  {
    name: "Hoàng Anh",
    rating: 5,
    time: "3 tuần trước",
    content:
      "Rất thích cách giảng viên minh họa bằng project thực tế. Sau khóa học, mình tự tin hơn khi làm việc với Spring Boot.",
    helpful: 7,
  },
];

const ratingStats = [
  { stars: 5, percent: 62 },
  { stars: 4, percent: 30 },
  { stars: 3, percent: 6 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const ReviewPage: React.FC = () => {
  const [filter, setFilter] = useState("Tất cả");
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Phản hồi của học viên</h2>
      <div className="flex items-center gap-8 mb-8">
        <div className="text-5xl font-bold text-yellow-600">4.7</div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-yellow-500 text-xl">★</span>
            ))}
            <span className="ml-2 text-gray-600">Đánh giá khóa học</span>
          </div>
          {ratingStats.map(stat => (
            <div key={stat.stars} className="flex items-center gap-2 mb-1">
              <div className="w-40 h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-2 bg-purple-400"
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
              <span className="ml-2 text-yellow-500">{stat.stars}★</span>
              <span className="ml-2 text-gray-600">{stat.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Đánh giá</h3>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          className="border rounded px-4 py-2 flex-1"
          placeholder="Tìm kiếm đánh giá"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="bg-purple-600 text-white px-4 rounded">
          <i className="fas fa-search"></i>
        </button>
        <select
          className="border rounded px-4 py-2"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option>Tất cả</option>
          <option>5 sao</option>
          <option>4 sao</option>
          <option>3 sao</option>
          <option>2 sao</option>
          <option>1 sao</option>
        </select>
      </div>

      {reviews
        .filter(r =>
          filter === "Tất cả" ? true : r.rating === Number(filter[0])
        )
        .filter(r =>
          r.content.toLowerCase().includes(search.toLowerCase())
        )
        .map((r, idx) => (
          <div key={idx} className="border-b pb-6 mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                {r.name.split(" ")[0][0]}
                {r.name.split(" ")[1]?.[0] || ""}
              </div>
              <div>
                <div className="font-bold">{r.name}</div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                  <span className="ml-2 text-gray-500">{r.time}</span>
                </div>
              </div>
            </div>
            <div className="mb-2">{r.content}</div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Bạn thấy đánh giá này hữu ích?</span>
              <button className="border rounded-full px-3 py-1 flex items-center gap-1 text-purple-700">
                <i className="far fa-thumbs-up"></i>
              </button>
              <button className="border rounded-full px-3 py-1 flex items-center gap-1 text-purple-700">
                <i className="far fa-thumbs-down"></i>
              </button>
              <button className="font-bold text-purple-700 underline ml-4">Báo cáo</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ReviewPage;