import React from 'react';
import { Link } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu cho một sự kiện đã được lưu
export interface StoredEvent {
  id: string;      // Dùng để làm key, có thể là sự kết hợp của type và payload
  type: 'CODE' | 'QUIZ' | 'UNKNOWN'; // Loại sự kiện
  payload: string; // ID của bài tập hoặc quiz
  title: string;   // Tên của bài tập hoặc quiz
  timestamp: Date; // Thời điểm sự kiện xảy ra
}

interface EventTabProps {
  events: StoredEvent[];
}

const EventTab: React.FC<EventTabProps> = ({ events }) => {

  const getIconForType = (type: StoredEvent['type']) => {
    switch (type) {
      case 'CODE':
        return <i className="fas fa-code text-purple-600"></i>;
      case 'QUIZ':
        return <i className="fas fa-question-circle text-blue-600"></i>;
      default:
        return <i className="fas fa-bell text-gray-600"></i>;
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">Chưa có sự kiện nào xảy ra.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Nhật ký sự kiện</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {/* Sắp xếp để sự kiện mới nhất lên đầu */}
          {[...events].reverse().map((event) => (
            <li key={event.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8 text-center">{getIconForType(event.type)}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {event.type === 'CODE' ? 'Bài tập lập trình' : 'Bài tập trắc nghiệm'} • {event.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {/* Nút chỉ hiển thị cho bài tập CODE */}
                {event.type === 'CODE' && (
                  <Link
                    to={`/code-exercise/${event.payload}`}
                    className="bg-purple-100 text-purple-700 font-semibold py-2 px-4 rounded-lg hover:bg-purple-200"
                  >
                    Làm bài
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventTab;