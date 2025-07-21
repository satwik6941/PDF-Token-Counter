
import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, XCircle } from 'lucide-react'; // Using lucide-react for icons

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  currentFileName: string | null;
  clearFile: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading, currentFileName, clearFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      if (event.dataTransfer.files[0].type === "application/pdf") {
        onFileSelect(event.dataTransfer.files[0]);
      } else {
        // Optionally, show an error message for non-PDF files
        console.warn("Only PDF files are accepted.");
      }
    }
  }, [onFileSelect]);
  
  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering click on the underlying div
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input field
    }
    clearFile();
  };


  return (
    <div className={`bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full transition-all duration-300 ${dragOver ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-700'} border-2 border-dashed`}>
      <div 
        className="flex flex-col items-center justify-center space-y-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          disabled={isLoading}
        />
        {!currentFileName && !isLoading && (
          <>
            <UploadCloud className={`w-16 h-16 ${dragOver ? 'text-blue-400' : 'text-gray-500'} transition-colors`} strokeWidth={1.5}/>
            <p className="text-gray-400 text-center">
              <button
                type="button"
                onClick={handleButtonClick}
                className="font-semibold text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded"
                disabled={isLoading}
              >
                Click to upload
              </button>
              {' '}or drag and drop a PDF file here.
            </p>
            <p className="text-xs text-gray-500">PDF files only, max 50MB.</p>
          </>
        )}
        {currentFileName && !isLoading && (
            <div className="text-center">
                <p className="text-lg text-green-400 font-semibold">File selected:</p>
                <p className="text-gray-300 break-all">{currentFileName}</p>
                <div className="mt-4 flex space-x-3 justify-center">
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out text-sm disabled:opacity-50"
                        disabled={isLoading}
                    >
                        Choose Another File
                    </button>
                    <button
                        type="button"
                        onClick={handleClearFile}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out text-sm flex items-center"
                        disabled={isLoading}
                    >
                        <XCircle size={18} className="mr-1.5" /> Clear
                    </button>
                </div>
            </div>
        )}
        {isLoading && currentFileName && (
            <div className="text-center">
                <p className="text-lg text-yellow-400 font-semibold">Processing:</p>
                <p className="text-gray-300 break-all">{currentFileName}</p>
            </div>
        )}
      </div>
    </div>
  );
};
