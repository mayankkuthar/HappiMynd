import { useEffect, useRef } from "react";

/**
 * useIsMounted
 *
 * Returns a ref whose `.current` value is `true` while the component is
 * mounted and flips to `false` as soon as it unmounts.
 *
 * Usage:
 *   const isMounted = useIsMounted();
 *
 *   const fetchData = async () => {
 *     const res = await someApi();
 *     if (!isMounted.current) return;   // guard every setState after an await
 *     setData(res.data);
 *   };
 */
const useIsMounted = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
};

export default useIsMounted;
