import { useEffect, useState } from "react";

// custom hook that syncs React state with localStroage
export default function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      // attempt to retrieve existing value from localStorage
      const storedValue = localStorage.getItem(key);

      if (storedValue !== null) {
        // parse and return saved value if it exists
        return JSON.parse(storedValue);
      }
    } catch (error) {
      // handles JSON parsing or access errors
      console.error(`Failed to read localStorage key "${key}":`, error);
    }

    // fallback to default value if nothing is stored or error occurs
    return defaultValue;
  });

  useEffect(() => {
    try {
      // persist updated state to localStorage whenever it changes
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      // handles storage quote or write errors
      console.error(`Failed to save localStorage key "${key}":`, error);

    }
  }, [key, state]);

  // returns state just like useState, but with persistence to localStorage6
  return [state, setState];
}