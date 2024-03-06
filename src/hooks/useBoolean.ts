import { useCallback, useState } from "react";

const useBoolean = (initialValue = false) => {
  const [state, setState] = useState<boolean>(initialValue);
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);
  const toggleState = () => setState((s) => !s);

  return {
    state,
    setState,
    setTrue,
    setFalse,
    toggleState,
  };
};

export default useBoolean;
