import React, { useState, useEffect } from 'react';

// Component Imports
import ConfigPanel from './components/ConfigPanel';
import CodeInput from './components/CodeInput';
import ResultsDisplay from './components/ResultsDisplay';

// Hook and Data Imports
import useScript from './hooks/useScript';
import { STYLELINT_RULES, DEFAULT_STYLELINT_RULES } from './data/defaults';

/**
 * App: The main application component, now powered by a working Stylelint browser bundle.
 */
export default function App() {
  // Correct, working CDN URL for a Stylelint browser bundle
  const isLinterLoaded = useScript('https://cdn.jsdelivr.net/npm/stylelint-bundle@14.9.1-fixup/dist/stylelint-bundle.js');
  
  const [css, setCss] = useState(`/* Welcome to the Stylelint Linter! */\n\nbody {\n    font-family: Arial, sans-serif;\n    color: #333;\n    z-index: 1000; \n}\n\n.important-notice {\n    color: red !important; /* Stylelint can flag this! */\n}\n\na {\n  color: #ff3300;\n}\n\n#myUniqueId {\n    margin: 10px;\n}\n`);
  const [results, setResults] = useState([]);
  const [hasLinted, setHasLinted] = useState(false);
  const [allRules, setAllRules] = useState([]);
  const [enabledRules, setEnabledRules] = useState({});
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false); // Unified readiness state

  // Effect 1: Initialize the linter with a static list of rules and set the initial enabled state.
  // This runs only when the linter script has loaded.
  useEffect(() => {
    // The browser bundle exposes the linter on `window.stylelint`
    if (isLinterLoaded && window.stylelint) {
      setAllRules(STYLELINT_RULES);
      
      // Set the initial state for which rules are enabled
      const initialRules = {};
      STYLELINT_RULES.forEach(rule => {
        initialRules[rule.id] = DEFAULT_STYLELINT_RULES.includes(rule.id);
      });
      setEnabledRules(initialRules);
      setIsReady(true); // Signal that all setup is complete.
    }
  }, [isLinterLoaded]);

  // Effect 2: This is the single source of truth for all linting operations.
  // It runs whenever the app is ready and either the CSS or the enabled rules change.
  useEffect(() => {
    if (isReady && window.stylelint) {
        // Create the configuration for Stylelint
        const stylelintRules = {};
        for (const ruleId in enabledRules) {
          if (enabledRules[ruleId]) {
            // Use 'true' for simple on/off rules. More complex rules might need specific values.
            stylelintRules[ruleId] = true;
          }
        }

        const config = {
            code: css,
            config: {
                rules: stylelintRules
            }
        };

        // Stylelint's lint function is asynchronous
        window.stylelint.lint(config)
            .then(resultObject => {
                // Adapt the Stylelint results to the format expected by ResultsDisplay
                const formattedResults = resultObject.results[0].warnings.map(w => ({
                    line: w.line,
                    message: w.text,
                    // Ensure the 'rule' object has an 'id' property for compatibility
                    rule: { id: w.rule }, 
                    type: w.severity, // 'error' or 'warning'
                }));
                setResults(formattedResults);
                setHasLinted(true);
            })
            .catch(err => {
                // Handle potential errors from the linter itself
                console.error("Stylelint error:", err);
            });
    }
  }, [isReady, css, enabledRules]); // Dependency array correctly triggers re-linting

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
                    <CodeInput css={css} setCss={setCss} onLint={() => { /* Manual lint button is now redundant but kept for UI */ }} />
                    <ResultsDisplay results={results} hasLinted={hasLinted} />
                </>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        <p>Powered by <a href="https://stylelint.io/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Stylelint</a> and React.</p>
      </footer>
    </div>
  );
}

