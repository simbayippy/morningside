// src/app/(main)/events/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container py-10">
      <h2>Something went wrong loading events</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
