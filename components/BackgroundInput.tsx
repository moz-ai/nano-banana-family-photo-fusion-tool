
import React from 'react';
import type { UploadedFile } from '../types';
import { PhotoIcon } from './icons/PhotoIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface BackgroundInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  image: UploadedFile | null;
  onImageChange: (file: File | null) => void;
  mode: 'text' | 'image';
  onModeChange: (mode: 'text' | 'image') => void;
}

const BackgroundInput: React.FC<BackgroundInputProps> = ({
  prompt,
  onPromptChange,
  image,
  onImageChange,
  mode,
  onModeChange,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageChange(file);
    event.target.value = ''; // Allow re-selecting same file
  };

  const removeImage = () => {
    onImageChange(null);
  };
  
  const commonButtonClasses = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors";
  const activeButtonClasses = "bg-blue-600 text-white";
  const inactiveButtonClasses = "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";


  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">2. Provide a Background</h2>
        <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <button onClick={() => onModeChange('text')} className={`${commonButtonClasses} ${mode === 'text' ? activeButtonClasses : inactiveButtonClasses}`}>
            By Text
          </button>
          <button onClick={() => onModeChange('image')} className={`${commonButtonClasses} ${mode === 'image' ? activeButtonClasses : inactiveButtonClasses}`}>
            By Image
          </button>
        </div>
      </div>
      
      {mode === 'text' ? (
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="e.g., 'A cozy living room with a fireplace' or 'A beautiful beach at sunset'"
          rows={4}
          className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
          aria-label="Background description"
        />
      ) : (
        <div>
          {!image ? (
            <label
              htmlFor="background-image-upload"
              className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <PhotoIcon className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> a background image
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Upload one image for the scene</p>
              </div>
              <input id="background-image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          ) : (
             <div className="relative group w-full h-32">
                <img src={image.preview} alt="Background preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                <button
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-all opacity-80 hover:opacity-100"
                  aria-label="Remove background image"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackgroundInput;
