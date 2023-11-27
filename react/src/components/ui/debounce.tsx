import React from 'react';

export const debounce = (
  eTarget: EventTarget & HTMLInputElement,
  delay: number,
  timeoutInstance: React.MutableRefObject<NodeJS.Timeout | null>,
  onFunctions: { [key: string]: () => any },
) => {
  if (timeoutInstance.current) clearTimeout(timeoutInstance.current);

  const timeout = setTimeout(() => {
    Object.entries(onFunctions).map(([key, value]) => {
      if (eTarget.name === key) value();
    });
  }, delay);

  timeoutInstance.current = timeout;

  return () => {
    if (timeoutInstance.current) clearTimeout(timeoutInstance.current);

    timeoutInstance.current = null;
  };
};
