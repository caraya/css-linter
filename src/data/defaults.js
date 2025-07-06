// Default recommended rules enabled on initial load for CSSLint
export const DEFAULT_ENABLED_RULES = [
  "important", "adjoining-classes", "known-properties", "box-sizing",
  "box-model", "overqualified-elements", "display-property-grouping",
  "bulletproof-font-face", "compatible-vendor-prefixes", "regex-selectors",
  "errors", "duplicate-background-images", "duplicate-properties",
  "empty-rules", "selector-max-approaching", "gradients", "fallback-colors",
  "font-sizes", "font-faces", "floats", "star-property-hack",
  "outline-none", "import", "ids", "underscore-hack", "universal-selector",
  "unqualified-attributes", "zero-units", "shorthand", "text-indent",
  "unique-headings", "qualified-headings"
];

// Example code for a custom rule (though this functionality is currently removed from App.jsx)
export const EXAMPLE_CUSTOM_RULE = `{
    id: 'high-z-index',
    name: 'Disallow high z-index',
    desc: 'Warns when z-index is set to a value greater than 99.',
    init: function(parser, reporter) {
        const rule = this;
        parser.addListener('property', function(event) {
            const propertyName = event.property.text.toLowerCase();
            const value = event.value;
            if (propertyName === 'z-index' && value.isInteger && value.text > 99) {
                reporter.report(
                    \`High z-index value (\${value.text}). Consider refactoring.\`,
                    event.line,
                    event.col,
                    rule
                );
            }
        });
    }
}`;
