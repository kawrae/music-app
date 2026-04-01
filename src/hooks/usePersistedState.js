import { useEffect, useState } from "react";

export default function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);

      if (storedValue !== null) {
        return JSON.parse(storedValue);
      }
    } catch (error) {
      console.error(`Failed to read localStorage key "${key}":`, error);
    }

    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Failed to save localStorage key "${key}":`, error);

    }
  }, [key, state]);

  return [state, setState];
}