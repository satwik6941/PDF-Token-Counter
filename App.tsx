
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Spinner } from './components/Spinner';
import { processPdfFile } from './services/pdfProcessor';
import { PageTokenData } from './types';

const App: React.FC = () => {
  const [pageTokens, setPageTokens] = useState<PageTokenData[] | null>(null);
  const [totalTokens, setTotalTokens] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!selectedFile) return;

    setFileName(selectedFile.name);
    setIsLoading(true);
    setError(null);
    setPageTokens(null);
    setTotalTokens(null);

    // Check if pdfjsLib is loaded
    if (!(window as any).pdfjsLib) {
        setError("PDF processing library failed to load. Please refresh the page.");
        setIsLoading(false);
        return;
    }
    
    // Ensure worker is set if not already
    if ((window as any).pdfjsLib && !(window as any).pdfjsLib.GlobalWorkerOptions.workerSrc) {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
    }


    try {
      const result = await processPdfFile(selectedFile);
      setPageTokens(result.pageTokens);
      setTotalTokens(result.totalTokens);
    } catch (err) {
      console.error("Error processing PDF:", err);
      if (err instanceof Error) {
        setError(`Failed to process PDF: ${err.message}`);
      } else {
        setError("An unknown error occurred while processing the PDF.");
      }
      setPageTokens(null);
      setTotalTokens(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearFile = () => {
    setFileName(null);
    setPageTokens(null);
    setTotalTokens(null);
    setError(null);
    // Reset file input visually if needed (can be tricky without direct DOM manipulation or key prop)
    // For simplicity, we'll rely on the user picking a new file or refreshing.
    // A common trick is to change the `key` of the FileUpload component to force a re-render.
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-8 selection:bg-blue-500 selection:text-white">
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
          PDF Token Counter
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Upload a PDF to count tokens per page and total.</p>
      </header>

      <main className="w-full max-w-2xl">
        <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} currentFileName={fileName} clearFile={clearFile} />

        {isLoading && (
          <div className="mt-8 flex flex-col items-center justify-center bg-gray-800 p-6 rounded-lg shadow-xl">
            <Spinner />
            <p className="mt-4 text-lg text-gray-300">Processing PDF, please wait...</p>
            {fileName && <p className="text-sm text-gray-500 mt-1">Analyzing: {fileName}</p>}
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-8 bg-red-800 border border-red-700 text-red-100 px-4 py-3 rounded-lg shadow-xl" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {!isLoading && !error && (pageTokens || totalTokens !== null) && (
          <ResultsDisplay 
            pageTokens={pageTokens} 
            totalTokens={totalTokens} 
            fileName={fileName}
          />
        )}
      </main>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} PDF Token Counter. All rights reserved.</p>
        <p>Powered by React, Tailwind CSS, and PDF.js</p>
      </footer>
    </div>
  );
};

export default App;
