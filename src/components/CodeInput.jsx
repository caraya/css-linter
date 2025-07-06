import React from 'react';
import { UploadIcon } from '../assets/Icons';

/**
 * CodeInput: Renders the textarea for CSS code and the file upload button.
 */
const CodeInput = ({ css, setCss, onLint }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/css") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCss(e.target.result);
        // Automatically lint after a file is loaded
        onLint(); 
      };
      reader.readAsText(file);
    } else if (file) {
      alert("Please upload a valid .css file.");
    }
  };

  const handleTextChange = (e) => {
    setCss(e.target.value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-800">Your CSS Code</h2>
        </div>
        <div className="p-4">
            <textarea
                value={css}
                onChange={handleTextChange}
                onBlur={onLint} // Trigger lint when the text area loses focus
                placeholder="Paste your CSS code here..."
                className="w-full h-64 p-3 font-mono text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                spellCheck="false"
            />
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <label htmlFor="file-upload" className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 cursor-pointer transition-colors">
                <UploadIcon />
                Upload .css File
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".css" onChange={handleFileChange} />
             <button
                onClick={onLint} // Trigger lint when the button is clicked
                className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
                Lint CSS
            </button>
        </div>
    </div>
  );
};

export default CodeInput;
