import { useEffect, useState } from 'react';

// Custom hook to detect window width
// export const useCustomMediaQuery = (query:any) => {
//     const [matches, setMatches] = useState(false);

//     useEffect(() => {
//       const media = window.matchMedia(query);
//       if (media.matches !== matches) {
//         setMatches(media.matches);
//       }

//       const listener = () => {
//         setMatches(media.matches);
//       };

//       media.addListener(listener);
//       return () => media.removeListener(listener);
//     }, [matches, query]);

//     return [matches];
//   };

// Custom hook to detect window width
export const useCustomMediaQuery = query => {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    // Ensure window is defined before proceeding
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);

    const listener = event => {
      setMatches(event.matches);
    };

    media.addListener(listener);
    // Update the state to the current value in case the initial state was set incorrectly
    setMatches(media.matches);

    return () => media.removeListener(listener);
  }, [query]);

  return [matches];
};
