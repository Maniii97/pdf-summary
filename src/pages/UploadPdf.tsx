import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface ServerResponse {
  text: string;
  // Add other fields based on the expected response from the backend
}

const UploadPDF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<ServerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post<ServerResponse>(
        "https://1846-2401-4900-3b3b-54f0-78d8-f3e1-2d5e-f844.ngrok-free.app/pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponse(res.data);
    } catch (err) {
      setError("An error occurred while uploading the file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = () => {
    if (!response || !response.text) return null;

    return {
      __html: response.text
        // // Replace **text** with <strong>text</strong>
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        // Replace ## text with <h2>text</h2> for headings
        .replace(/^## (.*)$/gm, "<h2>$1</h2>")
        // Replace * text with <li>text</li> for bullet points
        .replace(/^\* (.*)$/gm, "<li>$1</li>")
        // Replace `text` with <em>text</em> for italics
        .replace(/`(.+?)`/g, "<em>$1</em>") 
        // Replace regular newlines with <br />
        .replace(/\n/g, "<br />"),
    };
  };

  return (
    <div className="pdf">
      <h1
        style={{
          textAlign: "center",
        }}
      > Summarize PDFs
      </h1>
      <form
        style={{
          textAlign: "center",
        }}
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          name="pdf"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Upload</button>
      </form>

      {loading && (
        <p
          style={{
            textAlign: "center",
            fontSize: "25px",
          }}
        >
          Loading...
        </p>
      )}
      {error && <p style={{ color: "red" , fontSize : "20px" }}>{error}</p>}
      {response && (
        <div>
          <p
            className="res"
            dangerouslySetInnerHTML={
              renderFormattedText() as { __html: string }
            }
          />
        </div>
      )}
      <div className="footer">Made with ❤️ and ☕ by
      ‎ Mani</div>
    </div>
  );
};

export default UploadPDF;
