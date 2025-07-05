import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon, AlertOctagonIcon } from '../assets/Icons.jsx';

/**
 * ResultsDisplay: Renders the linting results in a table.
 */
const ResultsDisplay = ({ results, hasLinted }) => {
  // State 1: Before any linting has been performed.
  if (!hasLinted) {
      return (
          <div className="mt-6 p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700">Ready to Lint</h3>
              <p className="mt-1 text-sm text-gray-500">Paste your code or upload a file and click "Lint CSS" to see the results.</p>
          </div>
      );
  }
  
  // State 2: After linting, when no issues are found.
  if (results.length === 0) {
    return (
        <div className="mt-6 p-8 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
            <CheckCircleIcon />
            <div>
                <h3 className="text-lg font-semibold text-green-800">All Clear!</h3>
                <p className="text-green-700">No issues found in your CSS code. Great job!</p>
            </div>
        </div>
    );
  }

  // State 3: After linting, when issues are found.
  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-800">Linting Results ({results.length} issues found)</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {results.map((msg, index) => (
                    <tr key={index} className={msg.type === 'error' ? 'bg-red-50' : 'bg-yellow-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {msg.type === 'error' ? 
                            <span className="flex items-center text-red-700"><AlertOctagonIcon /> Error</span> : 
                            <span className="flex items-center text-yellow-800"><AlertTriangleIcon /> Warning</span>
                        }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{msg.line || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{msg.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{msg.rule.id}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ResultsDisplay;
