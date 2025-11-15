
import React, { useState } from 'react';
import type { BusinessData } from '../types';
import { fetchBusinessInsights } from '../services/geminiService';
import { SendIcon, LoadingIcon } from './Icons';

interface InsightsProps {
  businessData: BusinessData;
}

const exampleQueries = [
  "Which product is our most profitable?",
  "Summarize sales performance for the last month.",
  "Identify potential supply chain risks based on pending purchases.",
  "What are the top 3 selling products and why?",
];

export const Insights: React.FC<InsightsProps> = ({ businessData }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setResponse('');
    const result = await fetchBusinessInsights(query, businessData);
    setResponse(result);
    setIsLoading(false);
  };
  
  const handleExampleClick = (exampleQuery: string) => {
      setQuery(exampleQuery);
  }

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700">AI Business Insights</h3>
      <p className="mt-2 text-gray-600">Ask a question about your business data and get an AI-powered analysis.</p>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-2">Example questions:</p>
            <div className="flex flex-wrap gap-2">
                {exampleQueries.map((ex, i) => (
                    <button 
                        key={i}
                        onClick={() => handleExampleClick(ex)}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-full transition"
                    >
                        {ex}
                    </button>
                ))}
            </div>
        </div>
        <form onSubmit={handleQuery} className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What was our total revenue last month?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center justify-center w-28"
            disabled={isLoading}
          >
            {isLoading ? <LoadingIcon /> : <><SendIcon /> <span className="ml-2">Ask</span></>}
          </button>
        </form>
      </div>

      {(isLoading || response) && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Analysis</h4>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <LoadingIcon />
              <p className="ml-4 text-gray-600">Analyzing data...</p>
            </div>
          ) : (
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{response}</div>
          )}
        </div>
      )}
    </div>
  );
};
