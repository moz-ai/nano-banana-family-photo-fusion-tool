
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">2. Describe the Background</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., 'A cozy living room with a fireplace' or 'A beautiful beach at sunset'"
        rows={4}
        className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
      />
    </div>
  );
};

export default PromptInput;
