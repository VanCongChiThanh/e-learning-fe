import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getQuestionsForQuiz, getQuestionDetail } from '../api'; // Sử dụng API đã có

// Định nghĩa các ngôn ngữ được hỗ trợ (giống hệt CodingTag)
const supportedLanguages = [
  { id: 71, name: "Python (3.8.1)" },
  { id: 63, name: "JavaScript (Node.js 12.14.0)" },
  { id: 62, name: "Java (OpenJDK 13.0.1)" },
  { id: 54, name: "C++ (GCC 9.2.0)" },
];

// Kiểu dữ liệu cho một bài quiz coding
interface CodingQuizQuestion {
  id: string;
  questionText: string;
  stdin: string;         // Input cho bài toán
  answerText: string;    // Output mong muốn (sử dụng trường answerText)
}

// Kiểu dữ liệu cho kết quả từ server chấm bài
interface JudgeResult {
  stdout: string | null;
  time: string;
  memory: number;
  stderr: string | null;
  compile_output: string | null;
  status: {
    id: number;
    description: string;
  };
}

interface QuizTabProps {
  quizId: string;
}

const QuizTab: React.FC<QuizTabProps> = ({ quizId }) => {
  // State để lưu dữ liệu bài toán
  const [quizData, setQuizData] = useState<CodingQuizQuestion | null>(null);
  const [isFetchingQuiz, setIsFetchingQuiz] = useState(true);

  // State cho việc lập trình (lấy từ CodingTag.tsx)
  const [languageId, setLanguageId] = useState<number>(54); // Mặc định là C++
  const [sourceCode, setSourceCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tải dữ liệu đề bài khi quizId thay đổi
  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      setIsFetchingQuiz(true);
      setResult(null); // Xóa kết quả cũ
      setSourceCode(""); // Xóa code cũ
      try {
        // API trả về một mảng, ta lấy phần tử đầu tiên
        const quizDataArray: any[] = await getQuestionsForQuiz(quizId);
        if (quizDataArray && quizDataArray.length > 0) {
          const firstQuestion = quizDataArray[0];
          setQuizData({
            id: firstQuestion.id,
            questionText: firstQuestion.questionText,
            // Giả sử stdin được lưu trong một trường nào đó, nếu không có thì để rỗng
            // Ở đây tạm dùng một placeholder, bạn cần điều chỉnh cho đúng với backend
            stdin: firstQuestion.stdin || "5\n1 2 3 4 5", 
            answerText: firstQuestion.answerText || "1\n2\n3\n4\n5", // Đây là expectedOutput
          });
        }
      } catch (err) {
        setError("Không thể tải được đề bài. Vui lòng thử lại.");
        console.error("Lỗi khi tải câu hỏi quiz:", err);
      } finally {
        setIsFetchingQuiz(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Hàm gửi code đi chấm (giống hệt CodingTag.tsx)
  const handleTestCode = async () => {
    if (!quizData) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    const payload = {
      language_id: languageId,
      source_code: sourceCode,
      stdin: quizData.stdin,                  // Sử dụng stdin từ API
      expected_output: quizData.answerText, // Sử dụng answerText từ API làm output mong muốn
    };

    try {
      const response = await axios.post("https://judge-coursevo.vercel.app/api/judge/test", payload);
      setResult(response.data.judge_result);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Lỗi: ${err.response.status} - ${err.response.data.detail || err.message}`);
      } else {
        setError("Không thể kết nối đến máy chủ chấm bài. Vui lòng kiểm tra lại API!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingQuiz) return <div>Đang tải đề bài...</div>;
  if (!quizData) return <div>Không tìm thấy đề bài cho bài tập này.</div>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Phần hiển thị đề bài */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Đề bài: {quizData.questionText}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đầu vào (Input)</label>
            <pre className="bg-gray-100 p-3 rounded font-mono text-sm h-32 overflow-auto">{quizData.stdin}</pre>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đầu ra mong muốn (Expected Output)</label>
            <pre className="bg-gray-100 p-3 rounded font-mono text-sm h-32 overflow-auto">{quizData.answerText}</pre>
          </div>
        </div>
      </div>
      
      {/* Khu vực làm bài (giao diện giống CodingTag.tsx) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">Chọn ngôn ngữ</label>
          <select id="language-select" value={languageId} onChange={(e) => setLanguageId(Number(e.target.value))} className="w-full border rounded px-3 py-2 bg-white">
            {supportedLanguages.map((lang) => <option key={lang.id} value={lang.id}>{lang.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="source-code" className="block text-sm font-medium text-gray-700 mb-1">Lời giải của bạn</label>
          <textarea id="source-code" rows={18} className="w-full border rounded px-3 py-2 font-mono text-sm" placeholder="Viết code của bạn ở đây..." value={sourceCode} onChange={(e) => setSourceCode(e.target.value)} />
        </div>
      </div>

      <div className="mt-6">
        <button onClick={handleTestCode} disabled={isLoading} className="px-6 py-2 bg-[#106c54] text-white rounded font-semibold hover:bg-[#0d5a45] disabled:bg-green-300">
          {isLoading ? "Đang chấm..." : "Nộp bài và Chạy thử"}
        </button>
      </div>

      {/* Khu vực hiển thị kết quả (giống hệt CodingTag.tsx) */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Đã xảy ra lỗi</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-xl font-bold mb-4">Kết quả</h3>
          <div className={`px-3 py-1 inline-block rounded-full text-white text-sm mb-4 ${result.status.description === "Accepted" ? "bg-green-500" : "bg-red-500"}`}>
            {result.status.description}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
            <div><strong>Thời gian:</strong> {result.time}s</div>
            <div><strong>Bộ nhớ:</strong> {result.memory} KB</div>
          </div>
          {result.stdout && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Output của bạn:</label>
              <pre className="bg-gray-900 text-white p-3 rounded font-mono text-sm">{result.stdout}</pre>
            </div>
          )}
          {/* ... hiển thị stderr và compile_output nếu có ... */}
        </div>
      )}
    </div>
  );
};

export default QuizTab;