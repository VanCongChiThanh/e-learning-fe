import React, { useState } from "react";
import axios from "axios";

// Định nghĩa các ngôn ngữ được hỗ trợ dựa trên file POSTMAN_EXAMPLES.md
const supportedLanguages = [
  { id: 71, name: "Python (3.8.1)" },
  { id: 63, name: "JavaScript (Node.js 12.14.0)" },
  { id: 62, name: "Java (OpenJDK 13.0.1)" },
  { id: 54, name: "C++ (GCC 9.2.0)" },
  { id: 50, name: "C (GCC 9.2.0)" },
  { id: 74, name: "TypeScript (3.7.4)" },
];

// Định nghĩa kiểu cho kết quả trả về từ API
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

const CodingExerciseTab: React.FC = () => {
  const [languageId, setLanguageId] = useState<number>(71); // Mặc định là Python
  const [sourceCode, setSourceCode] = useState<string>("");
  const [stdin, setStdin] = useState<string>("");
  const [expectedOutput, setExpectedOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestCode = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    const payload = {
      language_id: languageId,
      source_code: sourceCode,
      stdin: stdin,
      expected_output: expectedOutput,
    };
    const jwtToken = process.env.jwtToken;

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/judge/test", payload,{
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
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

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Thực hành Code</h2>
      
      {/* Khu vực nhập liệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột trái: Ngôn ngữ và Source Code */}
        <div>
          <div className="mb-4">
            <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
              Chọn ngôn ngữ
            </label>
            <select
              id="language-select"
              value={languageId}
              onChange={(e) => setLanguageId(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 bg-white"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="source-code" className="block text-sm font-medium text-gray-700 mb-1">
              Mã nguồn của bạn
            </label>
            <textarea
              id="source-code"
              rows={15}
              className="w-full border rounded px-3 py-2 font-mono text-sm"
              placeholder="Viết code của bạn ở đây..."
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
            />
          </div>
        </div>
        
        {/* Cột phải: Input và Output */}
        <div>
          <div className="mb-4">
            <label htmlFor="stdin" className="block text-sm font-medium text-gray-700 mb-1">
              Standard Input (stdin)
            </label>
            <textarea
              id="stdin"
              rows={5}
              className="w-full border rounded px-3 py-2 font-mono text-sm"
              placeholder="Nhập đầu vào cho chương trình (nếu có)"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="expected-output" className="block text-sm font-medium text-gray-700 mb-1">
              Expected Output (Tùy chọn)
            </label>
            <textarea
              id="expected-output"
              rows={5}
              className="w-full border rounded px-3 py-2 font-mono text-sm"
              placeholder="Nhập kết quả mong đợi để so sánh"
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Nút thực thi */}
      <div className="mt-6">
        <button
          onClick={handleTestCode}
          disabled={isLoading}
          className="px-6 py-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 disabled:bg-purple-300"
        >
          {isLoading ? "Đang chạy..." : "Chạy thử"}
        </button>
      </div>

      {/* Khu vực hiển thị kết quả */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Đã xảy ra lỗi</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-xl font-bold mb-4">Kết quả</h3>
          <div
            className={`px-3 py-1 inline-block rounded-full text-white text-sm mb-4 ${
              result.status.description === "Accepted" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {result.status.description}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
            <div><strong>Thời gian:</strong> {result.time}s</div>
            <div><strong>Bộ nhớ:</strong> {result.memory} KB</div>
          </div>

          {result.stdout && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-1">Output (stdout):</label>
              <pre className="bg-gray-900 text-white p-3 rounded font-mono text-sm">{result.stdout}</pre>
            </div>
          )}

          {result.stderr && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-red-600 mb-1">Error (stderr):</label>
              <pre className="bg-red-100 text-red-800 p-3 rounded font-mono text-sm">{result.stderr}</pre>
            </div>
          )}

          {result.compile_output && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-yellow-600 mb-1">Compile Output:</label>
              <pre className="bg-yellow-100 text-yellow-800 p-3 rounded font-mono text-sm">{result.compile_output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodingExerciseTab;