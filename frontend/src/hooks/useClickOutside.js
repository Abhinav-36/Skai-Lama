import { useEffect, useRef } from 'react';

// handles clicks outside element
export const useClickOutside = (ref, callback, deps = []) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const clickHandler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callbackRef.current();
      }
    };

    document.addEventListener('mousedown', clickHandler);
    return () => document.removeEventListener('mousedown', clickHandler);
  }, [ref]);
};

