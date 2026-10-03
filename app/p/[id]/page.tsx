import { notFound } from "next/navigation";

type Paste = {
  id: string;
  title: string | null;
  content: string;
  pasteType: string;
  createdAt: string;
  expiresAt: string | null;
  maxViews: number | null;
  viewCount: number;
  sequenceData: {
    length: number;
    gcPercentage: number;
    isDNA: boolean;
    isRNA: boolean;
  } | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PastePage({ params }: PageProps) {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pastes/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    notFound();
  }

  const paste: Paste = await response.json();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow">

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {paste.title || "Untitled Paste"}
          </h1>

          <div className="mt-2 text-sm text-gray-500">
            Type: {paste.pasteType}
          </div>
        </div>

        {/* Sequence */}
        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            Sequence
          </h2>

          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-6 text-sm text-white">
            <code>{paste.content}</code>
          </pre>
        </div>

        {/* Bioinformatics Metadata */}
        {paste.sequenceData && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">
              Bioinformatics
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="rounded-lg bg-gray-100 p-4">
                <div className="text-sm text-gray-500">
                  Sequence Length
                </div>

                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {paste.sequenceData.length} bp
                </div>
              </div>

              <div className="rounded-lg bg-gray-100 p-4">
                <div className="text-sm text-gray-500">
                  GC Content
                </div>

                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {paste.sequenceData.gcPercentage.toFixed(2)}%
                </div>
              </div>

              <div className="rounded-lg bg-gray-100 p-4">
                <div className="text-sm text-gray-500">
                  DNA Sequence
                </div>

                <div className="mt-1 text-xl font-semibold">
                  {paste.sequenceData.isDNA ? "✓ Valid" : "✗ Invalid"}
                </div>
              </div>

              <div className="rounded-lg bg-gray-100 p-4">
                <div className="text-sm text-gray-500">
                  RNA Sequence
                </div>

                <div className="mt-1 text-xl font-semibold">
                  {paste.sequenceData.isRNA ? "✓ Valid" : "✗ Invalid"}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* View Information */}
        <div className="mt-6 text-sm text-gray-500">
          Views: {paste.viewCount}
          {paste.maxViews !== null && ` / ${paste.maxViews}`}
        </div>

      </div>
    </main>
  );
}