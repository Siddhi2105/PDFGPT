import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState("");
  const [selectedPdfName, setSelectedPdfName] = useState("");
  const [showPdf, setShowPdf] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Load PDFs on startup
  useEffect(() => {
    loadPDFs();
  }, []);
  // Focus input when app opens
useEffect(() => {
  inputRef.current?.focus();
}, []);

  const loadPDFs = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/pdf-list"
      );

      setPdfs(response.data.files);

      if (response.data.files.length > 0) {
        setSelectedPdf(
          response.data.files[0].url
        );

        setSelectedPdfName(
          response.data.files[0].name
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadPDF = async () => {
    if (!file) {
      alert("Select a PDF");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      setUploadMessage(response.data.message);

await loadPDFs();
setShowPdf(true);

setSelectedPdf(
  `http://localhost:8000/pdfs/${file.name}`
);

setSelectedPdfName(
  file.name
);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };
  const deletePDF = async (pdfName) => {

  // Remove instantly from UI
  setPdfs(prev =>
    prev.filter(pdf => pdf.name !== pdfName)
  );

  try {

    await axios.delete(
      `http://127.0.0.1:8000/delete-pdf/${pdfName}`
    );

    if (selectedPdfName === pdfName) {
      setSelectedPdf("");
      setSelectedPdfName("");
    }

  } catch (error) {

    console.error(error);

    // Reload if delete fails
    loadPDFs();

    alert("Delete failed");
  }
};

  const clearChat = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/clear-chat"
      );

      setMessages([]);

    } catch (error) {
      console.error(error);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

if (!selectedPdfName) {
  alert("Please select a PDF");
  return;
}

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/ask",
        {
          question,
          pdf_name: selectedPdfName,
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.answer,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    }

    setQuestion("");
inputRef.current?.focus();
setLoading(false);
  };

  return (
    <div className="h-screen flex bg-gray-100">

      {/* Sidebar */}
      <div
  className={`bg-white border-r flex flex-col transition-all duration-300 ${
    sidebarOpen ? "w-72" : "w-0 overflow-hidden"
  }`}
>

        <div className="p-4 border-b border-gray-800">
          <div>
  <h2 className="font-semibold text-lg">
    Documents
  </h2>

  <p className="text-sm text-gray-500">
    {pdfs.length} PDFs uploaded
  </p>
</div>
        </div>

        <div className="flex-1 overflow-y-auto">

          {pdfs.length === 0 && (
            <div className="p-4 text-gray-500">
              No PDFs uploaded
            </div>
          )}

          {pdfs.map((pdf) => (
  <div
    key={pdf.name}
    className="group mx-2 my-1 px-3 py-3 rounded-xl flex justify-between items-center hover:bg-gray-100 transition"
  >
    <div
      onClick={() => {
        setSelectedPdf(pdf.url);
        setSelectedPdfName(pdf.name);
      }}
      className={`flex-1 cursor-pointer ${
        selectedPdfName === pdf.name
? "font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg"
: "text-gray-700"
      }`}
    >
      📄 {pdf.name}
    </div>

   <button
  onClick={(e) => {
    e.stopPropagation();

    if (
      window.confirm(
        `Delete "${pdf.name}" ?`
      )
    ) {
      deletePDF(pdf.name);
    }
  }}
  className="opacity-0 group-hover:opacity-100 transition ml-2 text-red-600 hover:text-red-800"
>
  <FaTrash />
</button>
  </div>
))}

        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

       {/* Header */}
<div className="bg-white shadow p-4 flex justify-between items-center">

  <div className="flex items-center gap-3">

    <button
      onClick={() =>
        setSidebarOpen(!sidebarOpen)
      }
      className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
    >
      ☰
    </button>

    <div>
  <h1 className="text-xl font-bold">
    PDFGPT
  </h1>

  <p className="text-xs text-gray-500">
    Chat with your documents
  </p>
</div>

  </div>

  <div className="flex gap-2">

            <button
              onClick={() => setShowPdf(!showPdf)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              {showPdf ? <FaEyeSlash /> : <FaEye />}
              {showPdf ? "Hide PDF" : "Show PDF"}
            </button>

            <button
              onClick={clearChat}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Chat
            </button>

          </div>

        </div>


        {/* Upload Section */}
        <div className="bg-white border-b p-4 flex flex-wrap items-center gap-4">

          <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
            Select PDF

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </label>

          <span className="text-gray-600">
            {file
              ? file.name
              : "No file selected"}
          </span>

          <button
            onClick={uploadPDF}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Upload
          </button>

          {uploadMessage && (
            <span className="text-green-600">
              {uploadMessage}
            </span>
          )}

        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 max-w-5xl mx-auto w-full">
          {/* PDF Viewer */}
          {selectedPdf && showPdf && (
  <div className="mb-6 bg-white rounded-2xl shadow-lg overflow-hidden border">
    <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
  <span className="font-medium">
    {selectedPdfName}
  </span>

  <button
    onClick={() => setShowPdf(false)}
    className="text-sm text-gray-600 hover:text-black"
  >
    Close
  </button>
</div>
    <iframe
      src={selectedPdf}
      title="PDF Viewer"
      className="w-full h-[600px]"
    />
  </div>
)}

          {messages.length === 0 && (
            <div className="text-center text-gray-500">
              <div className="mt-32 text-center">
  <h2 className="text-3xl font-semibold mb-2">
    Welcome to PDFGPT
  </h2>

  <p className="text-gray-500">
    Upload a PDF and ask questions about it.
  </p>
</div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                  {msg.role === "user" ? "U" : "AI"}
                </div>
                <div
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white shadow-md border"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white shadow p-4 rounded-2xl">
                <div className="flex gap-1 text-xl">
  <span className="animate-pulse">●</span>
  <span className="animate-pulse delay-150">●</span>
  <span className="animate-pulse delay-300">●</span>
</div>
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>

        </div>

        {/* Selected PDF Indicator */}
        <div className="bg-gray-200 px-4 py-2 text-sm">
          Selected PDF:
          <span className="font-bold ml-2">
            {selectedPdfName || "None"}
          </span>
        </div>

        {/* Input */}
<div className="bg-white border-t p-4">

  <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3 shadow-sm">

    <input
      ref={inputRef}
      type="text"
      placeholder="Ask anything about your PDF..."
      value={question}
      onChange={(e) =>
        setQuestion(e.target.value)
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          askQuestion();
        }
      }}
      className="flex-1 bg-transparent outline-none"
    />

    <button
      onClick={askQuestion}
      className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition"
    >
      Send
    </button>

  </div>

</div>

      </div>

    </div>
  );
}

export default App;