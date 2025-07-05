import React, { useState } from 'react';
import { EXAMPLE_CUSTOM_RULE } from '../data/defaults';

/**
 * CustomRulesManager: A component to add and manage custom linting rules.
 */
const CustomRulesManager = ({ customRules, addCustomRule, deleteCustomRule, ruleError }) => {
    const [newRuleName, setNewRuleName] = useState('');
    const [newRuleCode, setNewRuleCode] = useState(EXAMPLE_CUSTOM_RULE);

    const handleAddRule = () => {
        addCustomRule(newRuleName, newRuleCode);
        setNewRuleName('');
        setNewRuleCode(EXAMPLE_CUSTOM_RULE); // Reset to example
    };

    const getRuleId = (ruleCode) => {
        try {
            // Use regex to find the id property in the rule code string
            const match = ruleCode.match(/id:\s*['"]([^'"]+)['"]/);
            return match ? match[1] : 'invalid code';
        } catch {
            return 'parsing error';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
            <details>
                <summary className="w-full p-4 font-semibold text-gray-800 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer list-none">
                    <span className="flex-grow">Custom Rule Manager</span>
                    <svg className="w-5 h-5 transform transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </summary>
                <div className="p-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Add New Custom Rule</h3>
                    <p className="text-sm text-gray-600 mb-4">Provide a name for your rule and paste the JavaScript object for the rule below. The object must have `id`, `name`, `desc`, and `init` properties.</p>
                    {ruleError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{ruleError}</p></div>}
                    
                    <label htmlFor="rule-name" className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                    <input
                        id="rule-name"
                        type="text"
                        value={newRuleName}
                        onChange={(e) => setNewRuleName(e.target.value)}
                        placeholder="e.g., High Z-Index Check"
                        className="w-full p-3 mb-4 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />

                    <label htmlFor="rule-code" className="block text-sm font-medium text-gray-700 mb-1">Rule Code</label>
                    <textarea
                        id="rule-code"
                        value={newRuleCode}
                        onChange={(e) => setNewRuleCode(e.target.value)}
                        placeholder="Paste your rule code here..."
                        className="w-full h-48 p-3 font-mono text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        spellCheck="false"
                    />
                    <button onClick={handleAddRule} className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Add Rule
                    </button>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-2">Saved Custom Rules ({customRules.length})</h3>
                    {customRules.length > 0 ? (
                        <ul className="space-y-2">
                            {customRules.map((rule, index) => (
                                <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800">{rule.name}</span>
                                        <span className="text-xs font-mono text-gray-500">ID: {getRuleId(rule.code)}</span>
                                    </div>
                                    <button onClick={() => deleteCustomRule(index)} className="text-sm text-red-600 hover:text-red-800 font-semibold">Delete</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No custom rules have been added yet.</p>
                    )}
                </div>
            </details>
        </div>
    );
};

export default CustomRulesManager;
