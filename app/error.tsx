"use client";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-900">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm">{error.message}</p>
      <button
        type="button"
        className="mt-4 rounded bg-red-900 px-4 py-2 text-sm font-medium text-white"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
