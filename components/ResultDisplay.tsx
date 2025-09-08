
import React from 'react';
import Spinner from './Spinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
  isLoading: boolean;
  image: string | null;
  onDownload: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, image, onDownload }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px] lg:min-h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 self-start">3. Your Fused Portrait</h2>
      <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700">
        {isLoading && (
          <div className="flex flex-col items-center text-center text-gray-600 dark:text-gray-400">
            <Spinner />
            <p className="mt-4 font-semibold">Fusing photos with AI magic...</p>
            <p className="text-sm">This can take a moment.</p>
          </div>
        )}
        {!isLoading && !image && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="font-semibold">Your generated portrait will appear here.</p>
            <p className="text-sm">Upload photos and write a prompt to begin.</p>
          </div>
        )}
        {!isLoading && image && (
          <img src={image} alt="Generated family portrait" className="object-contain w-full h-full rounded-md" />
        )}
      </div>

      {!isLoading && image && (
        <button
          onClick={onDownload}
          className="mt-4 flex items-center justify-center gap-2 w-full max-w-xs mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 shadow-md"
        >
          <DownloadIcon className="w-5 h-5" />
          Download Image
        </button>
      )}
    </div>
  );
};

export default ResultDisplay;
