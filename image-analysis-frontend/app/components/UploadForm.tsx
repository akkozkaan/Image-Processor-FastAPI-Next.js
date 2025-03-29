"use client";

import React, { useState } from "react";
import ImageAnalyzer from "./ImageAnalyzer";

const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/analyze/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the image.");
      }

      const data = await response.json();
      console.log(data);

      // Update state with predictions and similar products
      setPredictions(data.predictions);
      setSimilarProducts(data.similar_products);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Upload
        </button>
      </form>

      {/* Pass predictions and similar products to ImageAnalyzer */}
      <ImageAnalyzer
        predictions={predictions}
        similarProducts={similarProducts}
      />
    </div>
  );
};

export default UploadForm;