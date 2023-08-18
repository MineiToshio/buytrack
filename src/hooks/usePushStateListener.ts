import { useEffect } from "react";

export const usePushStateListener = (
  callback: (searchParams: URLSearchParams) => void,
) => {
  useEffect(() => {
    const originalPushState = history.pushState;

    history.pushState = (data, title, url) => {
      originalPushState.apply(history, [data, title, url]);
      const urlParts = url?.toString()?.split("?") ?? [];
      const urlParams = new URLSearchParams(urlParts[1]);
      callback(urlParams);
    };

    return () => {
      history.pushState = originalPushState;
    };
  }, [callback]);
};
