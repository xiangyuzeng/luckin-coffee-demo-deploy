import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ErrorMessage = ({ children }: Props) => {
  if (!children) return null;
  return (
    <p className="mt-1 rounded p-1 text-red-600 dark:text-red-800">
      {children}
    </p>
  );
};

export default ErrorMessage;
