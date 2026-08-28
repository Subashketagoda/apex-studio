import { Suspense } from "react";
import BookingVerifyClient from "@/components/BookingVerifyClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [
    { id: "APX-1001" },
    { id: "APX-1002" },
    { id: "APX-2026-000001" },
  ];
}

export default async function BookingVerifyPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-accent font-mono text-xs tracking-widest uppercase">
          AUDITING DIGITAL PASS WITH FIRESTORE...
        </div>
      }
    >
      <BookingVerifyClient id={id} />
    </Suspense>
  );
}
