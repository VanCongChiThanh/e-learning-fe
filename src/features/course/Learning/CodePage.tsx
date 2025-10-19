import React, { useState, useEffect } from 'react';
// highlight-start
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
// highlight-end
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { getCodeExerciseDetail, ExerciseDetail, TestCase } from '../api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

// Định nghĩa các ngôn ngữ được hỗ trợ
const supportedLanguages = [
  { id: 71, name: "Python (3.8.1)" },
  { id: 63, name: "JavaScript (Node.js 12.14.0)" },
  { id: 62, name: "Java (OpenJDK 13.0.1)" },
  { id: 54, name: "C++ (GCC 9.2.0)" },
];

interface JudgeResult {
  stdout: string | null; time: string; memory: number; stderr: string | null;
  compile_output: string | null; status: { id: number; description: string; };
}

// --- COMPONENT HEADER CHO TRANG CODE ---
interface CodePageHeaderProps {
  onRunCode: () => void;
  onSubmitCode: () => void;
  isJudging: boolean;
}

const CodePageHeader: React.FC<CodePageHeaderProps> = ({ onRunCode, onSubmitCode, isJudging }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  // highlight-start
  const navigate = useNavigate(); // Hook to control navigation
  // highlight-end

  return (
    <header className="bg-gray-800 text-white p-3 flex items-center justify-between shadow-md flex-shrink-0">
      {/* Phần bên trái */}
      <div className="flex items-center gap-4">
        {/*// highlight-start*/}
        {/* Nút Back mới */}
        <button
          onClick={() => navigate(-1)} // Go back one step in history
          className="flex items-center gap-2 text-gray-300 hover:text-white"
          title="Back to Learning Page"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        {/*// highlight-end*/}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-green-400 font-extrabold text-xl">
            Course<span className="text-white">vo</span>
          </div>
        </Link>
        <Link to="/my-courses" className="flex items-center gap-2 text-gray-300 hover:text-white">
          <i className="fa-solid fa-list-ul"></i>
          <span>Problem List</span>
        </Link>
      </div>

      {/* Phần ở giữa */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRunCode}
          disabled={isJudging}
          className="px-4 py-1.5 bg-gray-600 text-white rounded font-semibold hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <i className="fa-solid fa-play text-sm"></i>
          {isJudging ? "Running..." : "Run"}
        </button>
        <button
          onClick={onSubmitCode}
          className="px-4 py-1.5 bg-green-600 text-white rounded font-semibold hover:bg-green-500 flex items-center gap-2"
        >
          <i className="fa-solid fa-paper-plane text-sm"></i>
          Submit
        </button>
      </div>

      {/* Phần bên phải */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium">{user.first_name}</span>
          </div>
        ) : (
          <Link to="/login" className="font-medium hover:text-gray-300">
            Log in
          </Link>
        )}
      </div>
    </header>
  );
};


const CodePage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [languageId, setLanguageId] = useState<number>(54);
  const [sourceCode, setSourceCode] = useState<string>("");
  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [judgeError, setJudgeError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'testcase' | 'result'>('testcase');
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);

  useEffect(() => {
    if (!exerciseId) return;
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const data = await getCodeExerciseDetail(exerciseId);
        setExercise(data);
        const firstVisibleTestCase = data.testCases.find(tc => !tc.isHidden);
        if (firstVisibleTestCase) {
          setSelectedTestCase(firstVisibleTestCase);
        }
      } catch (err) {
        setError("Không thể tải chi tiết bài tập.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [exerciseId]);

  const handleRunCode = async () => {
    if (!selectedTestCase) {
      setJudgeError("Vui lòng chọn một test case để chạy thử.");
      return;
    }
    setIsJudging(true);
    setResult(null);
    setJudgeError(null);
    setActiveTab('result');
    const payload = {
      language_id: languageId,
      source_code: sourceCode,
      stdin: selectedTestCase.inputData,
      expected_output: selectedTestCase.expectedOutput,
    };
    try {
      const response = await axios.post("https://judge-coursevo.onrender.com/api/judge/test", payload);
      setResult(response.data.judge_result);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setJudgeError(`Lỗi: ${err.response.status} - ${err.response.data.detail || err.message}`);
      } else {
        setJudgeError("Không thể kết nối đến máy chủ chấm bài.");
      }
    } finally {
      setIsJudging(false);
    }
  };

  const handleSubmitCode = () => {
    alert("Chức năng Submit chưa được cài đặt");
  };

  if (isLoading) return <div className="p-8 text-center bg-gray-900 text-white h-screen">Đang tải đề bài...</div>;
  if (error || !exercise) return <div className="p-8 text-center text-red-500 bg-gray-900 h-screen">{error}</div>;

  return (
    <div className="bg-gray-900 h-screen flex flex-col">
      <CodePageHeader
        onRunCode={handleRunCode}
        onSubmitCode={handleSubmitCode}
        isJudging={isJudging}
      />
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-3 flex-grow overflow-hidden">
        {/* Cột trái: Đề bài (chiếm 1/3) */}
        <div className="bg-gray-800 text-gray-300 rounded-lg shadow-md p-6 overflow-y-auto lg:col-span-1">
          <h1 className="text-2xl font-bold mb-4 text-white">{exercise.title}</h1>
          <div className="prose prose-invert max-w-none break-words">
            <ReactMarkdown>{exercise.problemStatement}</ReactMarkdown>
          </div>
          
          <div className="mt-8">
            {exercise.testCases.filter(tc => !tc.isHidden).map((tc, index) => (
              <div key={tc.id} className="mb-4">
                <h3 className="font-semibold text-lg text-white">Example {index + 1}:</h3>
                <div className="bg-gray-900 p-3 rounded-md mt-2 font-mono text-sm leading-relaxed">
                  <p><strong className="text-gray-400">Input:</strong> {tc.inputData}</p>
                  <p><strong className="text-gray-400">Output:</strong> {tc.expectedOutput}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Trình soạn thảo và kết quả (chiếm 2/3) */}
        <div className="flex flex-col gap-3 overflow-hidden lg:col-span-2">
          {/* Vùng code */}
          <div className="bg-gray-800 rounded-lg shadow-md flex flex-col flex-grow">
            <div className="p-2 border-b border-gray-700">
              <select
                value={languageId}
                onChange={(e) => setLanguageId(Number(e.target.value))}
                className="border border-gray-600 rounded px-3 py-1 bg-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {supportedLanguages.map((lang) => <option key={lang.id} value={lang.id}>{lang.name}</option>)}
              </select>
            </div>
            <textarea
              className="flex-grow w-full border-none rounded-b-lg p-3 font-mono text-sm bg-gray-900 text-gray-100 focus:ring-0 resize-none"
              placeholder="Viết code của bạn ở đây..."
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
            />
          </div>

          {/* Vùng Test Case và Kết quả */}
          <div className="bg-gray-800 rounded-lg shadow-md flex flex-col h-1/3">
            <div className="flex border-b border-gray-700">
              <button onClick={() => setActiveTab('testcase')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'testcase' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400'}`}>Test Case</button>
              <button onClick={() => setActiveTab('result')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'result' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400'}`}>Result</button>
            </div>
            <div className="p-4 flex-grow overflow-y-auto text-gray-300">
               {activeTab === 'testcase' && (
                <div>
                  <div className="flex gap-2 mb-4">
                    {exercise.testCases.filter(tc => !tc.isHidden).map((tc, index) => (
                      <button key={tc.id} onClick={() => setSelectedTestCase(tc)} className={`px-3 py-1 rounded text-sm ${selectedTestCase?.id === tc.id ? 'bg-purple-600 text-white' : 'bg-gray-700'}`}>
                        Case {index + 1}
                      </button>
                    ))}
                  </div>
                  {selectedTestCase && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-semibold text-gray-400">Input:</label>
                        <pre className="bg-gray-900 p-2 rounded mt-1 font-mono">{selectedTestCase.inputData}</pre>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-400">Expected Output:</label>
                        <pre className="bg-gray-900 p-2 rounded mt-1 font-mono">{selectedTestCase.expectedOutput}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'result' && (
                <div>
                  {isJudging && <p>Đang chấm bài...</p>}
                  {judgeError && <div className="text-red-500 font-semibold">{judgeError}</div>}
                  {result && (
                    <div>
                      <div className={`px-3 py-1 inline-block rounded-full text-white text-sm mb-4 ${result.status.description === "Accepted" ? "bg-green-500" : "bg-red-500"}`}>
                        {result.status.description}
                      </div>
                      {result.stdout && (
                          <div>
                          <label className="block text-sm font-semibold text-gray-400 mb-1">Your Output:</label>
                          <pre className="bg-gray-900 text-white p-3 rounded font-mono text-sm">{result.stdout}</pre>
                          </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodePage;