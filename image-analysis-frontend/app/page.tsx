"use client";

import { useState } from "react";
import UploadForm from "./components/UploadForm";
import ImageAnalyzer from "./components/ImageAnalyzer";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Image Analysis and Product Finder</h1>

      <UploadForm onFileSelect={handleFileSelect} />

      {selectedFile && <ImageAnalyzer selectedFile={selectedFile} />}
    </main>
  );
}
