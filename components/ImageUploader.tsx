
import React, { useCallback, useEffect } from 'react';
import type { UploadedFile } from '../types';
import { PhotoIcon } from './icons/PhotoIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (fileName: string) => void;
  onClearAll: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesChange, uploadedFiles, onRemoveFile, onClearAll }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesChange(Array.from(event.target.files));
      // Reset the input value to allow selecting the same file again after removing it
      event.target.value = '';
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFilesChange(Array.from(event.dataTransfer.files));
      event.dataTransfer.clearData();
    }
  }, [onFilesChange]);

  const onDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  useEffect(() => {
    // The parent component `App.tsx` handles revoking URLs, which is the
    // robust approach for managing object URL lifecycle in this app structure.
    return () => {
       // Cleanup is handled by the parent.
    };
  }, []);


  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">1. Upload Photos</h2>
      <label
        htmlFor="file-upload"
        className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <PhotoIcon className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Add one or more photos</p>
        </div>
        <input id="file-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
           <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Selected Photos:</h3>
            {uploadedFiles.length > 1 && (
              <button
                onClick={onClearAll}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                aria-label="Clear all selected photos"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-2">
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.file.name} className="relative group">
                <img src={uploadedFile.preview} alt={uploadedFile.file.name} className="w-full h-24 object-cover rounded-lg shadow-md" />
                <button
                  onClick={() => onRemoveFile(uploadedFile.file.name)}
                  className="absolute top-0 right-0 -mt-2 -mr-2 bg-white dark:bg-gray-800 rounded-full p-0.5 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${uploadedFile.file.name}`}
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
