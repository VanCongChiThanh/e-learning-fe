import React, { useState, useEffect } from "react";
import { noteApi } from "../api";

interface NoteTabProps {
  lectureId: string;
  userId: string;
}

interface Note {
  noteId: string;
  content: string;
  createdAt: number;
}

const NoteTab: React.FC<NoteTabProps> = ({ lectureId, userId }) => {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch notes từ API
  const fetchNotes = async () => {
    try {
      const data = await noteApi.getNotes(lectureId, userId);
      setNotes(data);
    } catch {
      alert("Không thể tải ghi chú!");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [lectureId, userId]);

  // Lưu note mới
  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const newNote = await noteApi.createNote(lectureId, userId, content);
      setNotes(prev => [newNote, ...prev]);
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      alert("Có lỗi khi lưu ghi chú!");
    }
    setSaving(false);
  };

  // Xóa note
  const handleDelete = async (noteId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa ghi chú này?")) return;
    try {
      await noteApi.deleteNote(lectureId, noteId, userId);
      setNotes(prev => prev.filter(note => note.noteId !== noteId));
    } catch {
      alert("Có lỗi khi xóa ghi chú!");
    }
  };

  // Format thời gian từ createdAt
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Thời gian và khung nhập ghi chú */}
      <div className="flex items-center gap-4 mb-2">
        <span className="bg-gray-100 px-3 py-1 rounded-full font-semibold text-sm">0:15</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <select className="border rounded px-2 py-1 text-sm">
              <option>Styles</option>
            </select>
            <button className="font-bold px-2">B</button>
            <button className="italic px-2">I</button>
            <button className="px-2">•</button>
            <button className="px-2">&lt;/&gt;</button>
            <span className="ml-auto text-gray-400 text-xs">1000</span>
          </div>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Nhập ghi chú của bạn tại đây..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-4 mt-2 mb-6">
        <button className="text-gray-500 font-semibold">Hủy</button>
        <button
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700"
        >
          {saving ? "Đang lưu..." : "Lưu ghi chú"}
        </button>
      </div>
      {success && (
        <div className="mt-2 text-green-600 font-medium">Đã lưu ghi chú!</div>
      )}

      {/* Bộ lọc và sắp xếp */}
      <div className="flex gap-4 mb-4">
        <select className="border rounded px-4 py-2 font-semibold text-purple-700">
          <option>Tất cả bài giảng</option>
        </select>
        <select className="border rounded px-4 py-2 font-semibold text-purple-700">
          <option>Sắp xếp mới nhất</option>
        </select>
      </div>

      {/* Hiển thị ghi chú đã lưu */}
      {notes.length === 0 && (
        <div className="text-gray-500">Chưa có ghi chú nào</div>
      )}
      {notes.map(note => (
        <div key={note.noteId} className="mb-4">
          <div className="flex items-center gap-4 mb-2">
            <span className="bg-gray-100 px-3 py-1 rounded-full font-semibold text-sm">{formatTime(note.createdAt)}</span>
            <div>
              <span className="font-bold">Ghi chú</span>
            </div>
            <button
              onClick={() => alert("Chức năng chỉnh sửa chưa làm")}
              className="ml-auto px-2 text-gray-500 hover:text-purple-600"
            >
              <i className="fas fa-pen"></i>
            </button>
            <button
              onClick={() => handleDelete(note.noteId)}
              className="px-2 text-gray-500 hover:text-red-600"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
          <div className="bg-gray-100 rounded px-4 py-4">{note.content}</div>
        </div>
      ))}
    </div>
  );
};

export default NoteTab;
