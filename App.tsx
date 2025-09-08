
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import BackgroundInput from './components/BackgroundInput';
import ResultDisplay from './components/ResultDisplay';
import { generateFamilyPortrait, BackgroundInput as BackgroundInputType } from './services/geminiService';
import type { UploadedFile } from './types';

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [backgroundPrompt, setBackgroundPrompt] = useState<string>('An outdoor park setting with warm, sunny lighting.');
  const [backgroundImage, setBackgroundImage] = useState<UploadedFile | null>(null);
  const [backgroundInputMode, setBackgroundInputMode] = useState<'text' | 'image'>('text');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleFilesChange = (files: File[]) => {
    const newFiles = files
      .filter(file => !uploadedFiles.some(uploaded => uploaded.file.name === file.name))
      .map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prevFiles => {
      const fileToRemove = prevFiles.find(f => f.file.name === fileName);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter(f => f.file.name !== fileName);
    });
  };

  const clearAllFiles = () => {
    uploadedFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setUploadedFiles([]);
  };

  const handleBackgroundImageChange = (file: File | null) => {
    if (backgroundImage) {
      URL.revokeObjectURL(backgroundImage.preview);
    }
    if (file) {
      setBackgroundImage({
        file,
        preview: URL.createObjectURL(file),
      });
    } else {
      setBackgroundImage(null);
    }
  };

  const handleGenerate = useCallback(async () => {
    const hasBackground = (backgroundInputMode === 'text' && backgroundPrompt) || (backgroundInputMode === 'image' && backgroundImage);
    if (uploadedFiles.length === 0 || !hasBackground) {
      setError('Please upload at least one person photo and provide a background.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const files = uploadedFiles.map(f => f.file);
      
      const background: BackgroundInputType = (backgroundInputMode === 'image' && backgroundImage)
        ? { type: 'image', value: backgroundImage.file }
        : { type: 'text', value: backgroundPrompt };

      const result = await generateFamilyPortrait(files, background);
      
      if (result.image) {
        setGeneratedImage(`data:image/png;base64,${result.image}`);
      } else {
         setError('The AI did not return an image. Please try adjusting your prompt or using different photos.');
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFiles, backgroundPrompt, backgroundImage, backgroundInputMode]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'family-portrait.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-200 dark:from-gray-900 dark:to-slate-800 text-gray-800 dark:text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 dark:from-blue-400 dark:to-indigo-300">
            AI Family Photo Fusion
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Merge multiple photos into one beautiful family portrait with Gemini.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6 p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <ImageUploader onFilesChange={handleFilesChange} uploadedFiles={uploadedFiles} onRemoveFile={removeFile} onClearAll={clearAllFiles} />
            <BackgroundInput
              prompt={backgroundPrompt}
              onPromptChange={setBackgroundPrompt}
              image={backgroundImage}
              onImageChange={handleBackgroundImageChange}
              mode={backgroundInputMode}
              onModeChange={setBackgroundInputMode}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || uploadedFiles.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 dark:disabled:text-gray-400 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? 'Generating Your Portrait...' : '✨ Generate Portrait'}
            </button>
            {error && <p className="text-red-500 dark:text-red-400 mt-2 text-center">{error}</p>}
          </div>

          <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <ResultDisplay 
              isLoading={isLoading} 
              image={generatedImage} 
              onDownload={handleDownload}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
