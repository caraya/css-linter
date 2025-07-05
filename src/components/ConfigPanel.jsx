import React from 'react';

/**
 * ConfigPanel: Renders the configuration options for CSSLint rules.
 */
const ConfigPanel = ({ rules, enabledRules, onRuleToggle, isExpanded, setIsExpanded }) => {
  if (!rules.length) {
    return <div className="p-4 text-center text-gray-500">Loading configuration...</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left font-semibold text-gray-800 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span>Linter Configuration ({Object.values(enabledRules).filter(Boolean).length} / {rules.length} rules enabled)</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="p-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Select the CSS specifications to lint against. Changes will be applied automatically.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rules.sort((a, b) => a.name.localeCompare(b.name)).map(rule => (
              <label key={rule.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={!!enabledRules[rule.id]}
                  onChange={() => onRuleToggle(rule.id)}
                />
                <span className="ml-3 text-sm text-gray-700">{rule.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
