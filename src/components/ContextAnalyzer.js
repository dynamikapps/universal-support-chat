import React, { useState, useEffect } from 'react';
import { analyzeImage } from '../services/openai';
import { extractPageContent } from '../utils/helpers';

const ContextAnalyzer = () => {
  const [pageContext, setPageContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeCurrentPage();
  }, []);

  const analyzeCurrentPage = async () => {
    setIsAnalyzing(true);
    try {
      const content = await extractPageContent();
      const analysis = await analyzeImage(content);
      setPageContext(analysis);
    } catch (error) {
      console.error('Error analyzing page:', error);
      setPageContext('Unable to analyze the current page.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Page Context</h2>
      {isAnalyzing ? (
        <p>Analyzing page content...</p>
      ) : (
        <div>
          <p className="mb-4">{pageContext}</p>
          <button
            onClick={analyzeCurrentPage}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Refresh Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default ContextAnalyzer;