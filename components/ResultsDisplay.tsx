
import React from 'react';
import { PageTokenData } from '../types';
import { FileText, Hash, BookOpen } from 'lucide-react'; // Using lucide-react for icons

interface ResultsDisplayProps {
  pageTokens: PageTokenData[] | null;
  totalTokens: number | null;
  fileName: string | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ pageTokens, totalTokens, fileName }) => {
  if (!pageTokens && totalTokens === null) {
    return null;
  }

  return (
    <div className="mt-8 bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full">
      <div className="flex items-center mb-6 pb-4 border-b border-gray-700">
        <FileText size={32} className="text-blue-400 mr-3" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-100">Token Analysis Complete</h2>
          {fileName && <p className="text-sm text-gray-400 break-all">Results for: {fileName}</p>}
        </div>
      </div>

      {totalTokens !== null && (
        <div className="mb-6 bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <Hash size={24} className="text-green-400 mr-3" />
            <span className="text-xl font-semibold text-gray-200">Total Tokens:</span>
          </div>
          <span className="text-2xl font-bold text-green-400">{totalTokens.toLocaleString()}</span>
        </div>
      )}

      {pageTokens && pageTokens.length > 0 && (
        <div>
          <div className="flex items-center mb-3">
             <BookOpen size={20} className="text-teal-400 mr-2" />
             <h3 className="text-xl font-semibold text-gray-200">Tokens per Page:</h3>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar"> {/* Added custom-scrollbar class if needed */}
            {pageTokens.map(({ pageNumber, tokenCount }) => (
              <div
                key={pageNumber}
                className="flex justify-between items-center bg-gray-700/70 p-3 rounded-md hover:bg-gray-600/70 transition-colors duration-150"
              >
                <span className="text-gray-300">Page {pageNumber}:</span>
                <span className="font-medium text-blue-300">{tokenCount.toLocaleString()} tokens</span>
              </div>
            ))}
          </div>
        </div>
      )}
       {!pageTokens && totalTokens === 0 && (
         <p className="text-center text-gray-400 py-4">The PDF appears to have no text content or could not be processed.</p>
       )}
    </div>
  );
};
