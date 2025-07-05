import { useState, useEffect } from 'react';

/**
 * useScript: A custom React hook to dynamically load an external script.
 * @param {string} url - The URL of the script to load.
 * @returns {boolean} - A boolean indicating whether the script has loaded.
 */
const useScript = (url) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already on the page to avoid duplicates
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
        setIsLoaded(true);
        return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    
    // Optional: Add error handling
    script.onerror = () => {
        console.error(`Error loading script: ${url}`);
    };

    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      // Check if the script was added by this instance before removing
      const scriptToRemove = document.querySelector(`script[src="${url}"]`);
      if (scriptToRemove) {
          document.body.removeChild(scriptToRemove);
      }
    };
  }, [url]); // Only re-run the effect if the URL changes

  return isLoaded;
};

export default useScript;
