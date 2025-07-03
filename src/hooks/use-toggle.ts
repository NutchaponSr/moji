import { useCallback, useState } from "react"

export const useToggle = (initialValue = false): [boolean, () => void, (value: boolean) => void] => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const set = useCallback((value: boolean) => {
    setValue(value);
  }, []);

  return [value, toggle, set];
}