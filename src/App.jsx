import React, { useState, useEffect } from 'react';

// Component Imports
import ConfigPanel from './components/ConfigPanel';
import CodeInput from './components/CodeInput';
import ResultsDisplay from './components/ResultsDisplay';

// Hook and Data Imports
import useScript from './hooks/useScript';
import { STYLELINT_RULES, DEFAULT_STYLELINT_RULES } from './data/defaults';

/**
 * App: The main application component, now powered by Stylelint.
 */
export default function App() {
  // Use a more recent and stable CDN URL for a Stylelint browser bundle
  const isLinterLoaded = useScript('https://cdn.jsdelivr.net/npm/stylelint-bundle@16.5.0/dist/stylelint-bundle.min.js');
  
  const [css, setCss] = useState(`/* Welcome to the Stylelint Linter! */\n\nbody {\n    font-family: Arial, sans-serif;\n    color: red; /* color-no-named */\n    z-index: 1000; \n}\n\n.important-notice {\n    color: red !important; /* declaration-no-important */\n}\n\na {\n  color: #ff3300;\n}\n\n#myUniqueId {\n    margin: 10px;\n}\n`);
  const [results, setResults] = useState([]);
  const [hasLinted, setHasLinted] = useState(false);
  const [allRules, setAllRules] = useState([]);
  const [enabledRules, setEnabledRules] = useState({});
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [status, setStatus] = useState('loading'); // 'loading', 'ready', 'error'

  // Effect 1: Initialize the linter with a static list of Stylelint rules.
  // Includes a timeout to prevent infinite hanging.
  useEffect(() => {
    if (isLinterLoaded) {
      // Corrected: The browser bundle exposes the linter on `window.stylelint`
      if (window.stylelint) {
        setAllRules(STYLELINT_RULES);
        
        const initialRules = {};
        STYLELINT_RULES.forEach(rule => {
          initialRules[rule.id] = DEFAULT_STYLELINT_RULES.includes(rule.id);
        });
        setEnabledRules(initialRules);
        setStatus('ready'); // Signal that all setup is complete.
      }
    }
  }, [isLinterLoaded]);

  // Add a timeout for the loading process
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'loading') {
        setStatus('error');
      }
    }, 10000); // 10-second timeout

    return () => clearTimeout(timer); // Cleanup the timer
  }, [status]);

  // This function will now be called manually
  const triggerLint = () => {
    if (status === 'ready' && window.stylelint) {
      const stylelintRules = {};
      for (const ruleId in enabledRules) {
        if (enabledRules[ruleId]) {
          stylelintRules[ruleId] = true;
        }
      }

      const config = {
        code: css,
        config: {
          rules: stylelintRules
        }
      };

      window.stylelint.lint(config)
        .then(resultObject => {
          const formattedResults = resultObject.results[0].warnings.map(w => ({
            line: w.line,
            message: w.text,
            rule: { id: w.rule },
            type: w.severity,
          }));
          setResults(formattedResults);
          setHasLinted(true);
        })
        .catch(err => {
          console.error("Stylelint error:", err);
        });
    }
  };

  // Automatically lint when the configuration changes
  useEffect(() => {
    if (hasLinted) { // Only re-lint if an initial lint has happened
        triggerLint();
    }
  }, [enabledRules]);


  // Handler for toggling rules in the config panel
  const handleRuleToggle = (ruleId) => {
    setEnabledRules(prev => ({ ...prev, [ruleId]: !prev[ruleId] }));
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow">Loading Linter...</div>;
      case 'error':
        return <div className="p-4 text-center text-red-700 bg-red-50 rounded-lg shadow">Error: The linter script failed to load. Please check your network connection or try refreshing the page.</div>;
      case 'ready':
        return (
          <>
            <ConfigPanel 
                rules={allRules} 
                enabledRules={enabledRules} 
                onRuleToggle={handleRuleToggle}
                isExpanded={isConfigExpanded}
                setIsExpanded={setIsConfigExpanded}
            />
            <CodeInput css={css} setCss={setCss} onLint={triggerLint} />
            <ResultsDisplay results={results} hasLinted={hasLinted} />
          </>
        );
      default:
        return null;
    }
  }

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
            {renderContent()}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        <p>Powered by <a href="https://stylelint.io/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Stylelint</a> and React.</p>
      </footer>
    </div>
  );
}
