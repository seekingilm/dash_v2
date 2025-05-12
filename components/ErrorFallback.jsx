export default ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <pre>Maybe provided JSON file is not valid</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};
