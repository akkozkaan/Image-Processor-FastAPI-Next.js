"use client";

import React from "react";

interface Prediction {
  label: string;
  probability: number;
}

interface SimilarProduct {
  title: string;
  price: string;
  link: string;
}

interface ImageAnalyzerProps {
  predictions: Prediction[];
  similarProducts: SimilarProduct[];
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({
  predictions,
  similarProducts,
}) => {
  return (
    <div className="max-w-lg w-full mx-auto">
      {predictions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Predictions:</h3>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>
                <strong>{prediction.label}</strong>:{" "}
                {(prediction.probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {similarProducts.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Similar Products:</h3>
          <ul>
            {similarProducts.map((product, index) => (
              <li key={index}>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {product.title}: {product.price}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-gray-500">No similar products found.</p>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;