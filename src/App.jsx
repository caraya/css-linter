import React, { useState, useEffect, useCallback } from 'react';

// Component Imports
import CustomRulesManager from './components/CustomRulesManager';
import ConfigPanel from './components/ConfigPanel';
import CodeInput from './components/CodeInput';
import ResultsDisplay from './components/ResultsDisplay';

// Hook and Data Imports
import useScript from './hooks/useScript';
import { DEFAULT_ENABLED_RULES } from './data/defaults';

/**
 * App: The main application component.
 */
export default function App() {
  const isLinterLoaded = useScript('https://cdnjs.cloudflare.com/ajax/libs/csslint/1.0.5/csslint.min.js');
  const [css, setCss] = useState(`/* Welcome to the CSS Linter! */\n\nbody {\n    font-family: Arial, sans-serif;\n    color: #333;\n    z-index: 1000; /* Try the custom rule! */\n}\n\n.important-notice {\n    color: red !important; /* Using !important is often discouraged. */\n}\n\n.box {\n    width: 100px;\n    height: 100px;\n    border: 1px solid #000;\n    padding: 10px;\n    float: left; /* Floats can be tricky. */\n}\n\n#myUniqueId {\n    margin: 10px;\n}\n`);
  const [results, setResults] = useState([]);
  const [hasLinted, setHasLinted] = useState(false);
  const [allRules, setAllRules] = useState([]);
  const [enabledRules, setEnabledRules] = useState({});
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [customRules, setCustomRules] = useState([]);
  const [ruleError, setRuleError] = useState(null);

  // Load custom rules from localStorage on initial mount
  useEffect(() => {
    try {
        const storedRules = localStorage.getItem('csslintCustomRules');
        if (storedRules) {
            setCustomRules(JSON.parse(storedRules));
        }
    } catch (error) {
        console.error("Failed to load custom rules from localStorage", error);
        setRuleError("Could not load custom rules from storage. They might be corrupted.");
    }
  }, []);

  // Initialize rules once the CSSLint script and custom rules are loaded
  useEffect(() => {
    if (isLinterLoaded && window.CSSLint) {
      setRuleError(null); // Clear previous errors
      // Add custom rules to CSSLint
      customRules.forEach((rule) => {
          try {
              // Using new Function() is a safer way to evaluate string-based code than eval()
              const ruleObject = new Function(`return (${rule.code})`)();
              
              // Basic validation of the created rule object
              if (!ruleObject.id || !ruleObject.name || !ruleObject.desc || typeof ruleObject.init !== 'function') {
                  throw new Error(`Rule '${rule.name}' is missing required properties (id, name, desc, init).`);
              }
              
              // Check if rule already exists to prevent errors on hot-reload
              if (!window.CSSLint.getRules().find(r => r.id === ruleObject.id)) {
                window.CSSLint.addRule(ruleObject);
              }
          } catch (error) {
              console.error(`Error processing custom rule '${rule.name}':`, error);
              setRuleError(`Error in custom rule '${rule.name}': ${error.message}`);
          }
      });

      const availableRules = window.CSSLint.getRules();
      setAllRules(availableRules);
      
      const initialRules = {};
      availableRules.forEach(rule => {
        const isDefault = DEFAULT_ENABLED_RULES.includes(rule.id);
        const isCustom = customRules.some(r => {
            try { return new Function(`return (${r.code})`)().id === rule.id; } catch { return false; }
        });
        initialRules[rule.id] = isDefault || isCustom; // Enable custom rules by default
      });
      setEnabledRules(initialRules);
    }
  }, [isLinterLoaded, customRules]);

  const addCustomRule = (name, code) => {
      if (!name.trim()) {
          setRuleError("Custom rule must have a name.");
          return;
      }
      if (!code.trim()) {
          setRuleError("Custom rule code cannot be empty.");
          return;
      }
      const newRules = [...customRules, { name, code }];
      setCustomRules(newRules);
      localStorage.setItem('csslintCustomRules', JSON.stringify(newRules));
  };

  const deleteCustomRule = (indexToDelete) => {
      const newRules = customRules.filter((_, index) => index !== indexToDelete);
      setCustomRules(newRules);
      localStorage.setItem('csslintCustomRules', JSON.stringify(newRules));
      // Reloading is a simple way to reset the linter state with the new rule set
      window.location.reload(); 
  };

  const handleRuleToggle = (ruleId) => {
    setEnabledRules(prev => ({ ...prev, [ruleId]: !prev[ruleId] }));
  };

  const lintCss = useCallback(() => {
    if (!isLinterLoaded || !window.CSSLint) {
      alert("Linter is not loaded yet. Please wait a moment.");
      return;
    }

    const ruleset = {};
    for (const ruleId in enabledRules) {
      if (enabledRules[ruleId]) {
        ruleset[ruleId] = 1; // 1 for warning, 2 for error. We'll use 1 for all.
      }
    }
    
    const validation = window.CSSLint.verify(css, ruleset);
    setResults(validation.messages);
    setHasLinted(true);
  }, [css, enabledRules, isLinterLoaded]);
  
  // Automatically lint when enabled rules change, if linting has already occurred once.
  useEffect(() => {
    if(hasLinted) {
        lintCss();
    }
  }, [enabledRules, hasLinted, lintCss]);

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
            {!isLinterLoaded && 
                <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow">Loading CSSLint library...</div>
            }
            {isLinterLoaded && (
                <>
                    <CustomRulesManager 
                        customRules={customRules}
                        addCustomRule={addCustomRule}
                        deleteCustomRule={deleteCustomRule}
                        ruleError={ruleError}
                    />
                    <ConfigPanel 
                        rules={allRules} 
                        enabledRules={enabledRules} 
                        onRuleToggle={handleRuleToggle}
                        isExpanded={isConfigExpanded}
                        setIsExpanded={setIsConfigExpanded}
                    />
                    <CodeInput css={css} setCss={setCss} onLint={lintCss} />
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
