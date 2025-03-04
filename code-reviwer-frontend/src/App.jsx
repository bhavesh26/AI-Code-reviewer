import { useState } from "react";
import  ReactMarkDown from 'react-markdown'
export default function App() {
  const [url, setUrl] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReview = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://code-reviewer.bhaveshbhayal8.workers.dev/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: url.trim() }),
      });

      if (!response.ok) throw new Error("Failed to fetch review");

      const data = await response.json();
      setReviewData(data?.choices[0]?.message?.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center  bg-[url(./assets/logo.png)] h-screen bg-auto bg-center  bg-contain bg-no-repeat " > 
    <div className="rounded">
      <h1 className="text-3xl pt-24 pl-24 pr-24"> GitHub PR Review</h1>
    
    
      {/* Input Field */}
      <div className="flex items-center w-full pl-24 pr-24 pt-4">
      <input
      className="w-full h-8 text-lg  text-center border border-gray-300 rounded-lg bg-white"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter PR URL"
       
      />
      </div>
     

      {/* Review Button */}
      <div className="flex items-center w-full pl-24 pr-24 pt-4">
      <button
      className="bg-black w-full h-8 text-white rounded ml-8 mr-8"
        onClick={handleReview}
        
        disabled={loading}
      >
        {loading ? "Reviewing..." : "Review"}
      </button>
      </div>
      

      {/* Error Message */}
      {error && <p >{error}</p>}

      {/* Display API Response */}
      
      {reviewData && (
        <div className="bg-gray-600 text-white pl-4 pr-4 pb-8">
       <ReactMarkDown>{reviewData}</ReactMarkDown> </div>
      )}
      </div>
      
    
    </div>
  );
}

