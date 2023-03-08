import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';

interface LoadingIndicatorProps {
  // Define the props for your component here
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = () => {
  const { promiseInProgress } = usePromiseTracker();
  return promiseInProgress ? <h1></h1> : null;
}

export default LoadingIndicator;
