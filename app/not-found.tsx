import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[360px] place-items-center text-center">
      <div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <Link href="/" className="mt-4 inline-block rounded bg-[#fbbc04] px-4 py-2 text-sm font-medium">
          Back to notes
        </Link>
      </div>
    </div>
  );
}
