import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface ServerResponse {
  text: string;
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
      const response = await axios.post<ServerResponse>(
        "https://adapted-concrete-shiner.ngrok-free.app/pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponse(response.data);
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
      >
        {" "}
        Summarize PDFs
      </h1>
      <form
        style={{
          textAlign: "center",
        }}
        onSubmit={handleSubmit}
      >
        <input
          style={{
            textAlign: "center",
          }}
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
      {error && (
        <div>
          <p style={{ color: "red", fontSize: "17px", textAlign: "center" }}>
            {error}
          </p>
          <p style={{ color: "red", fontSize: "17px", textAlign: "center" }}>
            Please try again
          </p>
        </div>
      )}
      {response && (
        <div>
          <p
            className="response"
            dangerouslySetInnerHTML={
              renderFormattedText() as { __html: string }
            }
          />
        </div>
      )}
      <div className="footer">Made with ❤️ and ☕ by ‎ Mani</div>
    </div>
  );
};

export default UploadPDF;
