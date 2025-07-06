import React, { useState, useEffect } from 'react';

// Component Imports
import ConfigPanel from './components/ConfigPanel';
import CodeInput from './components/CodeInput';
import ResultsDisplay from './components/ResultsDisplay';

// Hook and Data Imports
import useScript from './hooks/useScript';
import { DEFAULT_ENABLED_RULES } from './data/defaults';

/**
 * App: The main application component, reverted to use CSSLint.
 */
export default function App() {
  // Revert to the CSSLint CDN URL
  const isLinterLoaded = useScript('https://cdnjs.cloudflare.com/ajax/libs/csslint/1.0.5/csslint.min.js');
  
  const [css, setCss] = useState(`/* Welcome back to the CSSLint Linter! */\n\nbody {\n    font-family: Arial, sans-serif;\n    color: #333;\n    z-index: 1000; \n}\n\n.important-notice {\n    color: red !important; /* CSSLint can flag this! */\n}\n\n.box {\n    width: 100px;\n    height: 100px;\n    border: 1px solid #000;\n    padding: 10px;\n    float: left; /* Floats can be tricky. */\n}\n\n#myUniqueId {\n    margin: 10px;\n}\n`);
  const [results, setResults] = useState([]);
  const [hasLinted, setHasLinted] = useState(false);
  const [allRules, setAllRules] = useState([]);
  const [enabledRules, setEnabledRules] = useState({});
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Effect 1: Initialize the linter with CSSLint's rules.
  useEffect(() => {
    if (isLinterLoaded && window.CSSLint) {
      const availableRules = window.CSSLint.getRules();
      setAllRules(availableRules);
      
      const initialRules = {};
      availableRules.forEach(rule => {
        initialRules[rule.id] = DEFAULT_ENABLED_RULES.includes(rule.id);
      });
      setEnabledRules(initialRules);
      setIsReady(true);
    }
  }, [isLinterLoaded]);

  // Effect 2: The single source of truth for all linting operations.
  useEffect(() => {
    if (isReady) {
        const ruleset = {};
        for (const ruleId in enabledRules) {
          if (enabledRules[ruleId]) {
            ruleset[ruleId] = 1; // 1 for warning, 2 for error.
          }
        }
        
        const validation = window.CSSLint.verify(css, ruleset);
        // CSSLint's results are already in the correct format for ResultsDisplay
        setResults(validation.messages);
        setHasLinted(true);
    }
  }, [isReady, css, enabledRules]);

  // Handler for toggling rules in the config panel
  const handleRuleToggle = (ruleId) => {
    setEnabledRules(prev => ({ ...prev, [ruleId]: !prev[ruleId] }));
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">React CSS Linter</h1>
          <p className="text-gray-600 mt-1">A simple tool to check your CSS for errors and potential problems.</p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {!isReady && 
                <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow">Loading Linter...</div>
            }
            {isReady && (
                <>
                    <ConfigPanel 
                        rules={allRules} 
                        enabledRules={enabledRules} 
                        onRuleToggle={handleRuleToggle}
                        isExpanded={isConfigExpanded}
                        setIsExpanded={setIsConfigExpanded}
                    />
                    <CodeInput css={css} setCss={setCss} onLint={() => { /* Manual lint button is redundant */ }} />
                    <ResultsDisplay results={results} hasLinted={hasLinted} />
                </>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        <p>Powered by <a href="http://csslint.net/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">CSSLint</a> and React.</p>
      </footer>
    </div>
  );
}
